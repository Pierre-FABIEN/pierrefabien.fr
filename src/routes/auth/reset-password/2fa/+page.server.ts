import { verifyTOTP } from '@oslojs/otp';
import { getUserTOTPKey } from '$lib/lucia/user';
import {
	validatePasswordResetSessionRequest,
	setPasswordResetSessionAs2FAVerified
} from '$lib/lucia/passwordReset';
import { totpBucket } from '$lib/lucia/2fa';
import { fail, redirect } from '@sveltejs/kit';
import { resetUser2FAWithRecoveryCode } from '$lib/lucia/2fa';
import { recoveryCodeBucket } from '$lib/lucia/2fa';

import type { Actions, RequestEvent } from './$types';
import { recoveryCodeSchema } from '$lib/schema/recoveryCodeSchema';
import { totpCodeSchema } from '$lib/schema/totpCodeSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

export const load = async (event: RequestEvent) => {
	const { session, user } = await validatePasswordResetSessionRequest(event);

	if (session === null) {
		return redirect(302, '/auth/forgot-password');
	}
	if (!session.emailVerified) {
		return redirect(302, '/auth/reset-password/verify-email');
	}
	if (!user.registered2FA) {
		return redirect(302, '/auth/reset-password');
	}
	if (session.twoFactorVerified) {
		return redirect(302, '/auth/reset-password');
	}
	const totpForm = await superValidate(event, zod(totpCodeSchema));
	const recoveryCodeForm = await superValidate(event, zod(recoveryCodeSchema));

	return {
		totpForm,
		recoveryCodeForm
	};
};

export const actions: Actions = {
	totp: totpAction,
	recovery_code: recoveryCodeAction
};

async function totpAction(event: RequestEvent) {
	const { session, user } = await validatePasswordResetSessionRequest(event);

	const formData = await event.request.formData();

	const form = await superValidate(formData, zod(totpCodeSchema));

	if (session === null) {
		return message(form, 'Not authenticated');
	}
	if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
		return message(form, 'Forbidden');
	}
	if (!totpBucket.check(session.userId, 1)) {
		return message(form, 'Too many requests');
	}

	const code = formData.get('code');
	if (typeof code !== 'string') {
		return message(form, 'Invalid or missing fields');
	}
	if (code === '') {
		return message(form, 'Please enter your code');
	}
	const totpKey = await getUserTOTPKey(session.userId);
	if (totpKey === null) {
		return message(form, 'Forbidden');
	}
	if (!totpBucket.consume(session.userId, 1)) {
		return message(form, 'Too many requests');
	}

	try {
		const isValid = verifyTOTP(totpKey, 30, 6, code);

		if (!isValid) {
			return message(form, 'Invalid TOTP code');
		}
	} catch (error) {
		return fail(500, { message: 'Internal server error', form });
	}

	totpBucket.reset(session.userId);
	await setPasswordResetSessionAs2FAVerified(session.id);
	redirect(302, '/auth/reset-password');
}

async function recoveryCodeAction(event: RequestEvent) {
	const { session, user } = await validatePasswordResetSessionRequest(event);
	const formData = await event.request.formData();

	const form = await superValidate(formData, zod(recoveryCodeSchema));

	if (session === null) {
		return message(form, 'Not authenticated');
	}
	if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
		return message(form, 'Forbidden');
	}

	if (!recoveryCodeBucket.check(session.userId, 1)) {
		return message(form, 'Too many requests');
	}

	const { code } = form.data;

	if (typeof code !== 'string') {
		return message(form, 'Invalid or missing fields');
	}
	if (code === '') {
		return message(form, 'Please enter your code');
	}
	if (!recoveryCodeBucket.consume(session.userId, 1)) {
		return message(form, 'Too many requests');
	}

	const valid = await resetUser2FAWithRecoveryCode(session.userId, code);

	if (!valid) {
		return message(form, 'Invalid code');
	}

	recoveryCodeBucket.reset(session.userId);

	redirect(302, '/auth/reset-password');
}
