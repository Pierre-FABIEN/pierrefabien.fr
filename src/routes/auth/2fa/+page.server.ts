import { totpBucket } from '$lib/lucia/2fa';
import { fail, redirect } from '@sveltejs/kit';
import { getUserTOTPKey } from '$lib/lucia/user';
import { verifyTOTP } from '@oslojs/otp';
import { setSessionAs2FAVerified } from '$lib/lucia/session';

import type { Actions, RequestEvent } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { totpCodeSchema } from '$lib/schema/totpCodeSchema';

export const load = async (event: RequestEvent) => {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, '/auth/login');
	}
	if (!event.locals.user.emailVerified) {
		return redirect(302, '/auth/verify-email');
	}
	if (!event.locals.user.registered2FA) {
		return redirect(302, '/auth/2fa/setup');
	}
	if (event.locals.session.twoFactorVerified) {
		return redirect(302, '/auth/');
	}
	const totpForm = await superValidate(event, zod(totpCodeSchema));
	return { totpForm };
};

export const actions: Actions = {
	totp: async ({ request, locals }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(totpCodeSchema));

		if (!form.valid) {
			return message(form, 'Invalid data');
		}

		if (locals.session === null || locals.user === null) {
			return message(form, 'Not authenticated');
		}

		if (
			!locals.user.emailVerified ||
			!locals.user.registered2FA ||
			locals.session.twoFactorVerified
		) {
			return message(form, 'Forbidden');
		}

		if (!totpBucket.check(locals.user.id, 1)) {
			return message(form, 'Too many requests');
		}

		const code = formData.get('code');
		if (typeof code !== 'string') {
			return message(form, 'Invalid or missing fields');
		}
		if (code === '') {
			return message(form, 'Please enter your code');
		}
		if (!totpBucket.consume(locals.user.id, 1)) {
			return message(form, 'Too many requests');
		}

		const totpKey = await getUserTOTPKey(locals.user.id);
		if (totpKey === null) {
			return message(form, 'Forbidden');
		}

		try {
			const isValid = verifyTOTP(totpKey, 30, 6, code);

			if (!isValid) {
				return fail(400, { message: 'Invalid TOTP code', form });
			}
			console.log('Vérification TOTP réussie.');
		} catch (error) {
			return fail(500, { message: 'Internal server error', form });
		}

		totpBucket.reset(locals.user.id);
		await setSessionAs2FAVerified(locals.session.id);
		redirect(302, '/auth/');
	}
};
