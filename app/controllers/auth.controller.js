const bCrypt = require("bcryptjs");
const passport = require("passport");
const fetch = require("node-fetch");

//!IMPORT HELPER,LIB,CONFIG & MODELS
const { verifyAccMail, resetPassMail } = require("../config/mailOptions.config");
const { religionData, genderData } = require("../lib/formData");
const { verificationData } = require("../lib/verificationData");
const { users } = require("../models");
const { generateUser,
  findEmailUser,
  validateUser,
  findLocationUser,
  generateToken,
  findMatchToken,
  generateTemplateEmail,
  getDistrictAPI } = require("../helpers/queryFunction.helper");

//!CREATE VARIABLE ERRORS 
let errors;

//!START REGISTER
exports.getRegisterPage = async (req, res, next) => {
  try {
    const getDistrict = await getDistrictAPI(process.env.DISTRICT_BANDUNG_API);
    return res.render("auth/registerPage", {
      listDistrict: getDistrict,
      listGender: genderData,
      listReligion: religionData,
      reqFooter: true,
      msg: "",
      errorAlert: false,
      getTitle: "E-Kuisioner || Registrasi"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};

exports.registerHandler = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, address, district, religion, gender, pass1, pass2 } = req.body;

    //!VALIDATE USER 
    await validateUser(req, first_name, last_name, email, phone, address, district, religion, gender, pass1, pass2, res, next);

    //!GET GEO LOCATION USER FROM DISTRICT 
    let { getLocDetail, getZipCode } = await findLocationUser(district);

    //!CREATE HASH PASSWORD FROM BODY & USER  
    const hashPass = await bCrypt.hash(pass1, 10);
    const newUser = await generateUser(first_name, last_name, email, address, religion, gender, hashPass, phone, district, getLocDetail, getZipCode);

    //!CREATE NEW TOKEN REFERENCE FROM USER ID 
    const newToken = await generateToken(newUser);

    //!GENERATE TEMPLATE MAIL AND SEND TO USER 
    await generateTemplateEmail(req, process.env.VERIFY_ACC_PATH, newUser, newToken, verifyAccMail, verifyAccMail.subjectDetail, res, next);

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};

exports.verifyAccountHandler = async (req, res, next) => {
  try {
    const { getToken } = req.query;
    const matchToken = await findMatchToken(getToken);
    if (!matchToken) {
      return res.status(401).render("auth/reqTokenPage", {
        listTemplate: verificationData,
        msg: "Token tidak Valid/ Sudah Kadaluwarsa, Silahkan untuk coba me-generate token kembali",
        errorAlert: false,
        reqFooter: true,
        warningAlert: true,
        getTitle: "E-Kuisioner || Oops!"
      });
    }
    const updUser = await users.update({
      isVerified: true
    }, {
      where: {
        id: matchToken.UserId
      }
    });

    if (!updUser) {
      res.statusCode = 500;
      errors = new Error("Tidak bisa meng-update user,silahkan coba kembali beberapa saat.");
      next(errors);
    }
    return res.redirect("/auth/verification-success");

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};

exports.getVerifySuccessPage = (req, res) => {
  res.render("auth/verifyAccount/verifyAccSuccessPage", {
    msg: "",
    reqFooter: true,
    errorAlert: false,
    getTitle: "E-Kuisioner || Verifikasi Akun"
  });
};
//!END REGISTER 


//!START WAITING EMAIL RENDER
exports.waitingEmailPage = (req, res) => {
  res.render("auth/waitingEmailPage", {
    msg: "",
    reqFooter: true,
    errorAlert: false,
    getTitle: "E-Kuisioner || Cek Email Konfirmasi"
  });
};
//!END WAITING EMAIL RENDER 


//!START REQUEST TOKEN
exports.reqTokenPage = (req, res) => {
  res.render("auth/reqTokenPage", {
    listTemplate: verificationData,
    msg: "",
    errorAlert: false,
    reqFooter: true,
    warningAlert: false,
    getTitle: "E-Kuisioner || Meminta Ulang Token"
  });
};
exports.reqTokenHandler = async (req, res, next) => {
  try {
    const { email, choose_template } = req.body;
    const getEmail = await findEmailUser(email);
    if (!getEmail) {
      return res.status(404).render("error_handling/emailNotFoundPage", {
        msg: "",
        errorAlert: false,
        reqFooter: true,
        getTitle: "E-Kuisioner || Oops!"
      });
    }

    //!GENERATE CHOOSED TEMPLATE MAIL AND SENDED TO USER WITH TOKEN
    if (choose_template === "VERIFY_ACCOUNT") {

      //!GENERATE TOKEN
      const newTokenForVer = await generateToken(getEmail);
      await generateTemplateEmail(req, process.env.VERIFY_ACC_PATH, getEmail, newTokenForVer, verifyAccMail, verifyAccMail.subjectDetail, res, next);

    } else if (choose_template === "FORGOT_PASSWORD") {

      //!GENERATE TOKEN 
      const newTokenForReset = await generateToken(getEmail);
      await generateTemplateEmail(req, process.env.FORGOT_PASS_PATH, getEmail, newTokenForReset, resetPassMail, resetPassMail.subjectDetail, res, next);

    } else {
      //!DONT GENERATE TOKEN, RETURN 400 ERROR CODE 
      res.statusCode = 400;
      errors = new Error("Pilihan tidak valid,Pastikan Memilih Tujuan Pengiriman Dengan Tepat");
      return next(errors);
    }

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//!END REQUEST TOKEN 


//!START LOGIN
exports.getLoginPage = (req, res) => {
  res.render("auth/loginPage", {
    msg: "",
    errorAlert: false,
    reqFooter: false,
    warningAlert: false,
    successAlert: false,
    getTitle: "E-Kuisioner || Masuk"
  });
};

exports.loginHandler = async (req, res, next) => {
  try {
    const { email, password, gRecaptchaToken } = req.body;

    const getUser = await findEmailUser(email);

    //!GOOGLE RECAPTCHA v3 Authentication

    if (gRecaptchaToken === undefined || gRecaptchaToken === "" || gRecaptchaToken === null) {
      res.statusCode = 403;
      errors = new Error("Terjadi Kesalahan Pada Captcha,Silahkan Coba Kembali");
      return next(errors);
    }

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_GCAPTCHA_KEY}&amp;response= ${gRecaptchaToken}&amp;remoteip=${req.connection.remoteAddress}`;

    await fetch(verificationURL)
      .then(async () => {
        if (getUser) {
          const validPass = await bCrypt.compare(password, getUser.password_hashed);
          if (!validPass) {
            res.statusCode = 400;
            errors = new Error("Email atau Password Salah,Silahkan Coba Kembali");
            return next(errors);
          }
          if (getUser.isVerified === false) {
            return res.status(403).render("auth/reqTokenPage", {
              listTemplate: verificationData,
              msg: "Akun Kamu Belum Terverifikasi,silahkan untuk me-generate token untuk verifikasi ulang.",
              errorAlert: false,
              reqFooter: true,
              warningAlert: true,
              getTitle: "E-Kuisioner || Meminta Ulang Token"
            });
          }
          //!CHECK IF USER IS ADMIN OR NOT 
          if (getUser.isAdmin) {
            passport.authenticate("local", {
              successRedirect: "/admin/dashboard",
              failureRedirect: "/auth/login",
            })(req, res, next);
          } else {
            passport.authenticate("local", {
              successRedirect: "/users/dashboard",
              failureRedirect: "/auth/login",
            })(req, res, next);
          }
        } else {
          return res.status(404).render("error_handling/emailNotFoundPage", {
            msg: "",
            errorAlert: false,
            reqFooter: true,
            getTitle: "E-Kuisioner || Oops!"
          });
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        errors = new Error(err);
        return next(errors);
      });


  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};

exports.forgotPassPage = (req, res) => {
  res.render("auth/forgotPassword/forgotPassPage", {
    msgHeader: "Lupa Kata Sandi",
    msg: "",
    reqFooter: true,
    errorAlert: false,
    getTitle: "E-Kuisioner || Lupa Kata Sandi"
  });
};

exports.forgotPassHandler = async (req, res, next) => {
  try {
    const { searchEmail } = req.body;
    const getEmail = await findEmailUser(searchEmail);
    if (!getEmail) {
      res.statusCode = 404;
      return res.render("error_handling/emailNotFoundPage", {
        errorMsg: "Maaf, Email Tidak Ditemukan.",
        msg: "",
        reqFooter: true,
        errorAlert: false,
        getTitle: "E-Kuisioner || Oops!"
      });
    }
    //!CREATE NEW TOKEN REFERENCE FROM USER ID 
    const newToken = await generateToken(getEmail);

    //!GENERATE TEMPLATE MAIL AND SEND TO USER 
    await generateTemplateEmail(req, process.env.FORGOT_PASS_PATH, getEmail, newToken, resetPassMail, resetPassMail.subjectDetail, res, next);

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};

exports.confirmForgotPass = async (req, res, next) => {
  try {
    const { getToken } = req.query;
    const matchToken = await findMatchToken(getToken);

    if (!matchToken) {
      return res.status(401).render("auth/reqTokenPage", {
        listTemplate: verificationData,
        msg: "Token Tidak Valid / Sudah Kadaluwarsa, Silahkan untuk coba me-generate token kembali",
        errorAlert: false,
        reqFooter: true,
        warningAlert: true,
        getTitle: "E-Kuisioner || Oops!"
      });
    }
    return res.render("auth/forgotPassword/resetPasswordPage", {
      id: matchToken.UserId,
      msg: "",
      reqFooter: true,
      errorAlert: false,
      getTitle: "E-Kuisioner || Reset Kata Sandi"
    });

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};

exports.resetPassHandler = async (req, res, next) => {
  try {
    const { pass3, pass4, id } = req.body;
    if (!pass3.match(/([0-9])/)) {
      res.statusCode = 400;
      errors = new Error("Password Harus Berisi Angka");
      return next(errors);
    }
    if (!pass3.match(/([A-Z])/)) {
      res.statusCode = 400;
      errors = new Error("Password Harus Berisi Minimal 1 Huruf Kapital");
      return next(errors);
    }
    if (pass3 !== pass4) {
      res.statusCode = 400;
      errors = new Error("Password Tidak Cocok");
      return next(errors);
    }
    const newPass = await bCrypt.hash(pass3, 10);

    const updUser = await users.update({ password_hashed: newPass }, {
      where: {
        id: id
      }
    });
    if (!updUser) {
      errors = new Error("Tidak Bisa Meng-Update User,Silahkan Coba Kembali Beberapa saat");
      return next(errors);
    }
    return res.render("auth/loginPage", {
      msg: "Password Berhasil Diupdate ,Silahkan Login Untuk Melanjutkan",
      errorAlert: false,
      reqFooter: false,
      warningAlert: false,
      successAlert: true,
      getTitle: "E-Kuisioner || Ubah Password Berhasil"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//!END LOGIN 

//!LOGOUT
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  return res.redirect("/auth/login");
};
//!END LOGOUT