const localStategy = require("passport-local").Strategy;
const bCrypt = require("bcryptjs");

//!DEFINE MODELS HERE 
const { users } = require("../models");

module.exports = (passport) => {
  passport.use(
    new localStategy(
      {
        usernameField: "email",
        passwordField: "password",

      },
      async (username, password, done) => {
        try {
          const user = await users.findOne({
            where: {
              email: username
            }
          });
          if (!user) {
            return done(null, false, {
              message: "Email Tersebut Tidak Terdaftar, Silahkan Untuk Registrasi Terlebih Dahulu."
            });
          }
          if (user.isVerified === false) {
            return done(null, false, {
              message: "Akun Anda Belum Terverifikasi, Pastikan Sudah Registrasi Dan Mendapatkan Email Verifikasi Dari Kami."
            });
          }
          const isValid = await bCrypt.compare(password, user.password_hashed);
          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password Salah,Silahkan Coba Kembali"
            });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const findUser = await users.findOne({
        where: {
          id: id
        }
      });
      return done(null, findUser);
    } catch (error) {
      return done(error);
    }
  });
};