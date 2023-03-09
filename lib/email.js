import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";

const MAIL_URI = process.env.MAIL_URI;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PWD = process.env.MAIL_PWD;

if (!MAIL_URI || !MAIL_USER || !MAIL_PWD)
  throw new Error(
    "Please define the MAIL environment variables inside .env.local"
  );

function getNoreplyTransporter() {
  if (noreplyTransporter) return noreplyTransporter;
  noreplyTransporter = nodemailer.createTransport({
    host: MAIL_URI,
    port: 587,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PWD,
    },
  });
  return noreplyTransporter;
}

function getTemplate(templateName) {
  const templatePath = path.join(
    process.cwd(),
    `data/emailTemplates/${templateName}.hbs`
  );
  const source = fs.readFileSync(templatePath, "utf-8");
  return handlebars.compile(source);
}

export async function sendVerifyMail(to, templateArgs) {
  const template = getTemplate("verifyEmail");

  await getNoreplyTransporter().sendMail({
    from: '"Quak.world No Reply" <noreply@quak.world>',
    to: to,
    subject: "Email verification from Quak.world",
    html: template(templateArgs),
  });
}

export async function sendPwdRecoveryMail(to, templateArgs) {
  const template = getTemplate("pwdRecovery");

  await getNoreplyTransporter().sendMail({
    from: '"Quak.world No Reply" <noreply@quak.world>',
    to: to,
    subject: "Recover your password for quak.world!",
    html: template(templateArgs),
  });
}

export async function sendFeedbackMail(subject, templateArgs) {
  const template = getTemplate("feedback");

  await getNoreplyTransporter().sendMail({
    from: '"Quak Feedback" <noreply@quak.world>',
    to: "world.quak@gmail.com",
    subject: "Feedback: " + subject,
    html: template(templateArgs),
  });
}
