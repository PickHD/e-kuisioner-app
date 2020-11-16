const slugify = require("slugify");
const { users, quisioner_headers, input_types, option_groups, questions, option_choices, question_options, answers, completed_quisioner_users, Op } = require("../models");

const { optionAgreeDisagree } = require("../lib/optionsData");
const { religionData, genderData } = require("../lib/formData");
const { getDistrictAPI, generateOptionChoiceFromArray, generateQuestionOptions } = require("../helpers/queryFunction.helper");

let errors;

//! DASHBOARD PAGE 
exports.dashboardPage = async (req, res, next) => {
  try {
    const { count, rows } = await quisioner_headers.findAndCountAll({
      order: [["createdAt", "ASC"]],
      raw: true
    });

    return res.render("user/dashboardPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      userId: req.user.id,
      role: "Peserta E-Kuisioner",
      getListQuiHeader: rows,
      getCountQuiHeader: count,
      reqFooter: true,
      msg: "",
      warningAlert: false,
      errorAlert: false,
      getTitle: "E-Kuisioner || Dashboard"
    });

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
//! END DASHBOARD PAGE

//! PROFILE PAGE & HANDLER 
exports.profilePage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getDistrict = await getDistrictAPI(process.env.DISTRICT_BANDUNG_API);

    const getUser = await users.findOne({
      where: {
        id: id
      }
    });
    if (!getUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak ditemukan. Silahkan untuk mencoba kembali`);
      return next(errors);
    }

    return res.render("user/profilePage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      userId: req.user.id,
      role: "Peserta E-Kuisioner",
      listDistrict: getDistrict,
      listGender: genderData,
      listReligion: religionData,
      getUser: getUser,
      msg: "",
      errorAlert: false,
      reqFooter: true,
      getTitle: "E-Kuisioner || Profile Peserta"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
exports.profileHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updUser = await users.update(req.body, {
      where: {
        id: id
      }
    });
    if (!updUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak valid. Silahkan untuk mencoba kembali`);
      return next(errors);
    }
    return res.status(203).redirect("/users/dashboard");
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//! END PROFILE PAGE & HANDLER 

//! SUSPEND PAGE & HANDLER 
exports.suspendPage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getUser = await users.findOne({
      where: {
        id: id
      }
    });
    if (!getUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak ditemukan.Silahkan untuk mencoba kembali`);
      return next(errors);
    }
    return res.render("user/suspend/suspendAccPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      userId: getUser.id,
      getUser: getUser,
      role: "Peserta E-Kuisioner",
      msg: "",
      errorAlert: false,
      reqFooter: true,
      getTitle: "E-Kuisioner || Nonaktifkan Akun"
    });

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.suspendHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getUser = await users.findOne({
      where: {
        id: id
      }
    });
    if (!getUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak ditemukan.Silahkan untuk mencoba kembali`);
      return next(errors);
    }
    await users.update({ isActive: false }, { where: { id: id } });
    req.logout();
    req.session.destroy();
    return res.redirect("/auth/login");

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//! END SUSPEND PAGE & HANDLER 

//! QUISIONER PAGE 
exports.quisionerPage = async (req, res, next) => {
  try {
    let no = 1;
    let { getQuisionerTitle } = req.params;

    let getQuisionerSlugged = slugify(`${getQuisionerTitle}`, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      locale: "vi"
    });

    const { count, rows } = await quisioner_headers.findAndCountAll({});
    const getOneQui = await quisioner_headers.findOne({
      where: {
        quisioner_title: getQuisionerTitle
      }
    })
    const checkUser = await completed_quisioner_users.findOne({
      where: {
        UserId: req.user.id,
        [Op.and]: {
          QuisionerHeaderId: getOneQui.id
        }
      }
    });

    if (checkUser) {
      return res.render("user/dashboardPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        userId: req.user.id,
        role: "Peserta E-Kuisioner",
        getListQuiHeader: rows,
        getCountQuiHeader: count,
        reqFooter: true,
        msg: "Mohon Maaf, Setiap Peserta Hanya Bisa Sekali Mengisi Kuisioner. Silahkan Cari Kuisioner Yang Lain.",
        warningAlert: true,
        errorAlert: false,
        getTitle: "E-Kuisioner || Dashboard"
      });
    } else {
      const { rows } = await questions.findAndCountAll({
        include: [
          {
            model: quisioner_headers,
            required: true,
            where: {
              "quisioner_title": getQuisionerTitle
            },
          },
          {
            model: input_types,
            required: true
          },
          {
            model: option_groups,
            required: true
          }
        ],
      });

      if (!rows) {
        res.statusCode = 404;
        errors = new Error(`Kuisioner Dengan Judul :${getQuisionerTitle} tidak ditemukan,silahkan untuk kembali`);
        return next(errors);
      }

      return res.render("user/quisionerPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: "Peserta E-Kuisioner",
        getQuisionerSlugged: getQuisionerSlugged,
        getQuisionerTitle: getQuisionerTitle,
        userId: req.user.id,
        listQuestions: rows,
        isRadioType: true,
        listOptions: optionAgreeDisagree,
        noInc: no,
        reqFooter: true,
        msg: "",
        errorAlert: false,
        getTitle: "E-Kuisioner || Mengisi Kuisioner"
      });

    }


  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
exports.finishQuisionerHandler = async (req, res, next) => {
  try {
    const { getResult, optionGroupId, getQuisionerTitle } = req.body;
    const { getQuisionerSlugged } = req.params;

    let splittedResultArray = getResult.split(",");
    await generateOptionChoiceFromArray(splittedResultArray, optionGroupId, req.user.id);

    const getQuestionId = await questions.findAndCountAll({
      include: [
        {
          model: quisioner_headers,
          where: {
            quisioner_title: getQuisionerTitle,

          }
        },
      ],
      raw: true
    });
    const getOptionChoiceId = await option_choices.findAndCountAll({
      where: {
        UserId: req.user.id
      },
      raw: true
    });

    await generateQuestionOptions(getQuestionId.rows, getOptionChoiceId.rows);

    const getHeaderId = await quisioner_headers.findOne({
      where: {
        quisioner_title: getQuisionerTitle
      }
    })

    const { rows } = await question_options.findAndCountAll({
      include: [
        {
          model: questions,
          where: {
            QuisionerHeaderId: getHeaderId.id,
          }
        },
        {
          model: option_choices,
          where: {
            UserId: req.user.id
          }
        }
      ],
      raw: true
    });

    for (let x = 0; x < rows.length; x++) {
      await answers.create({
        QuestionOptionId: rows[x].id,
        UserId: req.user.id
      });
    }

    await completed_quisioner_users.create({
      UserId: req.user.id,
      QuisionerHeaderId: getHeaderId.id,
      isDone: true,
      completedAt: new Date()
    })

    return res.redirect("/users/dashboard");

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
//! END QUISIONER PAGE

