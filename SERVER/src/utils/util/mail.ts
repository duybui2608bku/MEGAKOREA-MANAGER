import nodemailer from 'nodemailer'

import { config } from 'dotenv'
import { userMessages } from '~/constants/messages/user/user.messages'

config()

const EMAIL_FROM = 'Megakorea  <no-reply@example.com>' as const
const NODE_MAILER_HOST = 'smtp.gmail.com'
const NODE_MAILER_PORT = 587

interface SendMailParams {
  email: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: NODE_MAILER_HOST,
  port: NODE_MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME as string,
    pass: process.env.APP_PASSWORD as string
  }
})

const sendMail = async ({ email, html }: SendMailParams): Promise<void> => {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: userMessages.FORGOT_PASSWORD_EMAIL_SUBJECT,
    html: html
  })
}

export default sendMail
