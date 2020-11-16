let getUser = "";
let data = "";

exports.verifyAccMail = {
  from: "E-Kuisioner Team <noreply.ekuisionerteam@gmail.com>",
  to: getUser.email,
  subject: `${getUser.first_name}`,
  html: data,
  subjectDetail: ",Mohon Untuk Verifikasi Akun Anda"
};

exports.resetPassMail = {
  from: "E-Kuisioner Team <noreply.ekuisionerteam@gmail.com>",
  to: getUser.email,
  subject: `${getUser.first_name}`,
  html: data,
  subjectDetail: ",Mohon Untuk Konfirmasi Ubah Kata Sandi Anda"
};