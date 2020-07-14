import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

type EmailOptions = {
  email: string;
  subject: string;
  message: string;
};

export async function sendEmail(options: EmailOptions) {
  const transport = nodemailer.createTransport({
    // @ts-ignore
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions: SendMailOptions = {
    from: 'Soramon sora@soramon.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
}
