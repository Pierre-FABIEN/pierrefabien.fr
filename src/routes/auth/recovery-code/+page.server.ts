import { getUserRecoverCode } from '$lib/lucia/user';
import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from './$types';

export const load = async (event: RequestEvent) => {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, '/auth/login');
	}
	if (!event.locals.user.emailVerified) {
		return redirect(302, '/auth/verify-email');
	}
	if (!event.locals.user.googleId) {
		if (!event.locals.user.registered2FA) {
			return redirect(302, '/auth/2fa/setup');
		}
		if (!event.locals.session.twoFactorVerified) {
			return redirect(302, '/auth/2fa');
		}
	}
	const recoveryCode = await getUserRecoverCode(event.locals.user.id);
	return {
		recoveryCode
	};
};
