const crypto = require("crypto");
const fetch = require("node-fetch");
const ejs = require("ejs");
const path = require("path");

const { transporter } = require("../config/transporter.config");
const { geoCoder } = require("../config/geoCoderOptions.config");
const { users, tokens, option_choices, question_options, Op, questions } = require("../models");

const findEmailUser = async (email) => {
  const tempEmail = await users.findOne({
    where: {
      email: email
    }
  });
  return tempEmail;
};

const validateUser = async (req, getFirst_name, getLast_name, getEmail, getPhone, getAddress, getDistrict, getReligion, getGender, getPass1, getPass2, res, next) => {

  //!SEARCH USER BY EMAIL
  const checkEmail = await findEmailUser(getEmail);

  //!VALIDATING 
  if (!getFirst_name || !getLast_name || !getEmail || !getPhone || !getAddress || !getReligion || !getGender || !getDistrict || !getPass1 || !getPass2) {
    res.statusCode = 400;
    errors = new Error("Data Anda Tidak Valid,Silahkan Coba Lagi.");
    return next(errors);
  }
  if (checkEmail) {
    res.statusCode = 400;
    errors = new Error("Email Sudah Terpakai");
    return next(errors);
  }
  if (!getPass1.match(/([0-9])/)) {
    res.statusCode = 400;
    errors = new Error("Password Harus Berisi Angka");
    return next(errors);
  }
  if (!getPass1.match(/([A-Z])/)) {
    res.statusCode = 400;
    errors = new Error("Password Harus Berisi Minimal 1 Huruf Kapital");
    return next(errors);
  }
  if (getPass1 !== getPass2) {
    res.statusCode = 400;
    errors = new Error("Password Tidak Cocok");
    return next(errors);
  }
};

const findLocationUser = async (getDistrict) => {
  let tempLocUser = await geoCoder.geocode(`${getDistrict}`);

  if (tempLocUser.length === 0) {
    let tempZipcodeNull = null;
    let tempLocDetailNull = {
      type: "Point",
      coordinates: [null, null]
    };
    return {
      getLocUser: tempLocUser,
      getLocDetail: tempLocDetailNull,
      getZipCode: tempZipcodeNull
    };

  } else {
    let tempZipcode = tempLocUser[0].zipcode;
    let tempLocDetail = {
      type: "Point",
      coordinates: [tempLocUser[0].latitude, tempLocUser[0].longitude]
    };

    return {
      getLocUser: tempLocUser,
      getLocDetail: tempLocDetail,
      getZipCode: tempZipcode
    };
  }
};
const generateUser = async (field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11) => {
  const tempUser = await users.create({
    first_name: field1,
    last_name: field2,
    email: field3,
    address: field4,
    religion: field5,
    gender: field6,
    password_hashed: field7,
    phone: field8,
    district: field9,
    location: field10 ? field10 : null,
    zipCode: field11 ? field11 : null,
  });
  await users.update({ isActive: true }, {
    where: {
      id: tempUser.id
    }
  });
  return tempUser;
};
const generateToken = async (userId) => {
  const tempToken = await tokens.create({
    token: crypto.randomBytes(16).toString("hex"),
    UserId: userId.id
  });
  return tempToken;
};
const findMatchToken = async (token) => {
  const matchToken = await tokens.findOne({
    where: {
      token: token
    }
  });
  return matchToken;
};
const getDistrictAPI = async (url) => {
  let tempArray = [];
  await fetch(`${url}`)
    .then(res => res.json())
    .then(json => {
      json.kecamatan.forEach(e => {
        tempArray.push(e.nama);
      });
    });
  return tempArray;
};
const generateTemplateEmail = async (req, getPath, getUser, getToken, objData, subDetail, res, next) => {
  let errors;
  //!RENDER MAIL TEMPLATE SELECTED BY USER
  ejs.renderFile(
    path.join(__dirname, `${getPath}`),
    {
      getUser: getUser.first_name,
      getHost: req.headers.host,
      getToken: getToken.token,
      getProtocol: req.protocol
    },
    (err, data) => {
      if (err) {
        errors = new Error(err);
        return next(errors);

      } else {
        //!REPLACE DATA OBJ WITH DATA IN PARAMETER
        objData.to = getUser.email;
        objData.subject = `${getUser.first_name}${subDetail}`;
        objData.html = data;

        //!SEND EMAIL TO USER
        transporter.sendMail(objData, (err) => {
          //!if error
          if (err) {
            errors = new Error(err);
            return next(errors);
          }
          //!redirect to waiting page
          return res.redirect("/auth/waiting-email");
        });
      }
    }
  );
};

const generateOptionChoiceFromArray = async (getArray, optId, userId) => {
  getArray.forEach(async (data) => {
    await option_choices.create({
      OptionGroupId: optId,
      option_choice_name: data,
      UserId: userId
    });
  });
};

const generateQuestionOptions = async (getQuestion, getOption) => {
  for (let i = 0; i < getQuestion.length; i++) {
    await question_options.create({
      QuestionId: getQuestion[i].id,
      OptionChoiceId: getOption[i].id
    });
  }
};

const generateListResponse = async (getQuestionId) => {
  let countSS = await question_options.count({
    include: [
      {
        model: questions,
        where: {
          id: getQuestionId
        }
      },
      {
        model: option_choices,
        where: {
          option_choice_name: "Sangat Setuju"
        },
      }
    ],

  });
  let countS = await question_options.count({
    include: [
      {
        model: questions,
        where: {
          id: getQuestionId
        }
      },
      {
        model: option_choices,
        where: {
          option_choice_name: "Setuju"
        },
      }
    ],

  });
  let countN = await question_options.count({
    include: [
      {
        model: questions,
        where: {
          id: getQuestionId
        }
      },
      {
        model: option_choices,
        where: {
          option_choice_name: "Netral"
        }
      }
    ],

  });
  let countTS = await question_options.count({
    include: [
      {
        model: questions,
        where: {
          id: getQuestionId
        }
      },
      {
        model: option_choices,
        where: {
          option_choice_name: "Tidak Setuju"
        }
      }
    ],

  });
  let countSTS = await question_options.count({
    include: [
      {
        model: questions,
        where: {
          id: getQuestionId
        }
      },
      {
        model: option_choices,
        where: {
          option_choice_name: "Sangat Tidak Setuju"
        }
      }
    ],

  });

  return [
    countSS, countS, countN, countTS, countSTS
  ];
};

module.exports = {
  findEmailUser,
  validateUser,
  findLocationUser,
  generateUser,
  generateToken,
  findMatchToken,
  generateTemplateEmail,
  getDistrictAPI,
  generateOptionChoiceFromArray,
  generateQuestionOptions,
  generateListResponse
};

