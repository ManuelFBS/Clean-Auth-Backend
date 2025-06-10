import nodemailer from 'nodemailer';
import { injectable } from 'inversify';
import { logger } from './Logger';

@injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendVerificationEmail(
        email: string,
        token: string,
    ): Promise<void> {
        const mailOptions = {
            from:
                process.env.EMAIL_FROM ||
                process.env.EMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `
        <h1>Verificación de cuenta</h1>
        <p>Por favor haz clic en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${process.env.BASE_URL}/verify-email?token=${token}">
          Verificar cuenta
        </a>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(
                `Email de verificación enviado a ${email}`,
            );
        } catch (error) {
            logger.error(
                `Error enviando email a ${email}: ${error}`,
            );
            throw new Error(
                'No se pudo enviar el email de verificación',
            );
        }
    }
}
