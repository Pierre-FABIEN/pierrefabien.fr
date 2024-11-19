import { prisma } from '$lib/server';
import { decryptToString, encryptString } from './encryption';
import { ExpiringTokenBucket } from './rate-limit';
import { generateRandomRecoveryCode } from './utils';

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
	userId: number,
	recoveryCode: string
): Promise<boolean> {
	// Récupérer le code de récupération chiffré
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { recoveryCode: true }
	});

	if (!user || !user.recoveryCode) {
		return false;
	}

	// Déchiffrer le code de récupération après décodage Base64
	const userRecoveryCode = decryptToString(Buffer.from(user.recoveryCode, 'base64'));
	if (recoveryCode !== userRecoveryCode) {
		return false;
	}

	// Générer un nouveau code de récupération chiffré
	const newRecoveryCode = generateRandomRecoveryCode();
	const encryptedNewRecoveryCode = encryptString(newRecoveryCode).toString('base64');

	// Mettre à jour le code de récupération et réinitialiser la 2FA
	const result = await prisma.$transaction([
		prisma.session.updateMany({
			where: { userId },
			data: { twoFactorVerified: false }
		}),
		prisma.user.updateMany({
			where: {
				id: userId,
				recoveryCode: user.recoveryCode
			},
			data: {
				recoveryCode: encryptedNewRecoveryCode,
				totpKey: null
			}
		})
	]);

	return result[1].count > 0;
}
