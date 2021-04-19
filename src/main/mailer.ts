import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { DATABASE_PATH, DB_NAME } from './config';

let transporter: Mail | undefined;

async function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PASSWORD, SMTP_USER } = process.env;

  if (
    [SMTP_HOST, SMTP_PASSWORD, SMTP_USER].some((el) => typeof el === undefined)
  ) {
    throw new Error('SMTP_HOST, SMTP_PASSWORD, or SMTP_USER missing');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    // secure: false, // true for 465, false for other ports
    tls: { rejectUnauthorized: false },
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.verify();
  return transporter;
}

export async function sendDatabaseToRecipient() {
  const {
    SMTP_RECIPIENT_EMAIL,
    SMTP_SENDER_EMAIL,
    SMTP_SENDER_NAME,
  } = process.env;

  if (
    [SMTP_RECIPIENT_EMAIL, SMTP_SENDER_EMAIL, SMTP_SENDER_NAME].some(
      (el) => typeof el === undefined
    )
  ) {
    throw new Error(
      'SMTP_RECIPIENT_EMAIL, SMTP_SENDER_EMAIL, or SMTP_SENDER_NAME missing'
    );
  }

  const transporter = await getTransporter();
  return transporter.sendMail({
    from: `"${SMTP_SENDER_NAME}" <${SMTP_SENDER_EMAIL}>`,
    to: SMTP_RECIPIENT_EMAIL,
    subject: 'Base de datos de inventario',
    text: 'Base de datos de inventario',
    attachments: [{ filename: DB_NAME, path: DATABASE_PATH }],
  });
}
