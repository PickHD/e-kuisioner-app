const nMailer = require("nodemailer");

if (process.env.NODE_ENV === "production") {
  exports.transporter = nMailer.createTransport({
    host: process.env.HOST_EMAIL_PROD,
    port: process.env.PORT_EMAIL_PROD,
    ignoreTLS: false,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL_PROD,
      pass: process.env.PASSWORD_EMAIL_PROD
    }
  });
  return;
} exports.transporter = nMailer.createTransport({
  host: process.env.HOST_EMAIL_DEV,
  port: process.env.PORT_EMAIL_DEV,
  auth: {
    user: process.env.USER_EMAIL_DEV,
    pass: process.env.PASSWORD_EMAIL_DEV
  }
});
