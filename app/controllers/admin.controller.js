const { users, quisioner_headers, input_types, option_groups, option_choices, questions, Sequelize } = require("../models");
const { getDistrictAPI, generateListResponse } = require("../helpers/queryFunction.helper");
const { religionData, genderData } = require("../lib/formData");
let errors;

//! DASHBOARD PAGE 
exports.dashboardPage = async (req, res, next) => {
  try {

    const { getQuestion } = req.query;

    const getUser = await users.count({
      where: {
        isAdmin: false
      }
    });
    const getQuiHeader = await quisioner_headers.count({});
    const getListQuestions = await questions.findAll({
      include: [
        {
          model: quisioner_headers,
          required: true
        },
        {
          model: input_types,
          required: true
        },
      ],
    });
    const getResponse = await option_choices.count({});


    if (getQuestion === null || !getQuestion) {
      return res.render("admin/dashboardPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: "Administrator",
        countUser: getUser,
        countQuisioner: getQuiHeader,
        countResponse: getResponse,
        getQuestion: "--Pilih Pertanyaan--",
        listQuestion: getListQuestions,
        listResponse: 0,
        reqFooter: true,
        msg: "",
        errorAlert: false,
        getTitle: "E-Kuisioner || Dashboard"
      });
    } else {

      const getCurrentQuestion = await questions.findOne({
        where: {
          id: getQuestion
        }
      });
      const [countSS, countS, countN, countTS, countSTS] = await generateListResponse(getQuestion);

      return res.render("admin/dashboardPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: "Administrator",
        countUser: getUser,
        countQuisioner: getQuiHeader,
        countResponse: getResponse,
        getQuestion: getCurrentQuestion.question_name,
        listQuestion: getListQuestions,
        listResponse: [countSS, countS, countN, countTS, countSTS],
        reqFooter: true,
        msg: "",
        errorAlert: false,
        getTitle: "E-Kuisioner || Dashboard"
      });
    }

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
//! END DASHBOARD PAGE

//! MANAGE USER HANDLER & PAGE 
exports.listUsersPage = async (req, res, next) => {
  try {
    const perPage = 20;
    let page = req.params.page || 1;
    let no = 1;
    let resOffset = (perPage * page) - perPage;

    const { count, rows } = await users.findAndCountAll({
      attributes: ["id", [Sequelize.literal("first_name || ' ' || last_name"), "full_name"], "email", "isActive"],
      where: {
        isAdmin: false,
      },
      order: [["first_name", "ASC"]],
      limit: perPage,
      offset: resOffset
    });

    return res.render("admin/manage_users/listUsersPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: "Administrator",
      getList: rows,
      current: page,
      pages: Math.ceil(count / perPage),
      noInc: no,
      reqFooter: true,
      msg: "",
      errorAlert: false,
      getTitle: "E-Kuisioner || Kelola User"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
exports.viewUserPage = async (req, res, next) => {
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
      errors = new Error(`User dengan id:${id} tidak ditemukan,pastikan user tersebut masih aktif. Silahkan untuk mencoba kembali`);
      return next(errors);
    }

    return res.render("admin/manage_users/viewUserPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      listDistrict: getDistrict,
      listGender: religionData,
      listReligion: genderData,
      getUser: getUser,
      role: "Administrator",
      reqFooter: true,
      msg: "",
      errorAlert: false,
      getTitle: "E-Kuisioner || Detail User"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.updateUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getUser = await users.update(req.body, {
      where: {
        id: id
      }
    });
    if (!getUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak valid. Silahkan untuk mencoba kembali`);
      return next(errors);
    }
    res.status(203).redirect("/admin/manage/users");
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.deleteUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delUser = await users.destroy({
      where: {
        id: id
      }
    });
    if (!delUser) {
      res.statusCode = 404;
      errors = new Error(`User dengan id:${id} tidak ditemukan.`);
      return next(errors);
    }
    return res.status(203).redirect("/admin/manage/users");
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//! END MANAGE USER HANDLER & PAGE

//! MANAGE QUISIONER HANDLER & PAGE 
exports.listQuisionerPage = async (req, res, next) => {
  try {
    const perPage = 20;
    let page = req.params.page || 1;
    let no = 1;
    let resOffset = (perPage * page) - perPage;

    const { count, rows } = await questions.findAndCountAll({
      include: [
        {
          model: quisioner_headers,
          required: true
        },
        {
          model: input_types,
          required: true
        },
        {
          model: option_groups,
          required: true
        },

      ],
      order: [[quisioner_headers, "createdAt", "ASC"]],
      limit: perPage,
      offset: resOffset
    });

    const getHeaders = await quisioner_headers.findAll({});

    return res.render("admin/manage_quisioner/listQuisionerPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: "Administrator",
      reqFooter: true,
      current: page,
      getList: rows,
      getListHeader: getHeaders,
      pages: Math.ceil(count / perPage),
      noInc: no,
      msg: "",
      errorAlert: false,
      getTitle: "E-Kuisioner || Kelola Kuisioner"
    });
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }

};
exports.createHeaderHandler = async (req, res, next) => {
  try {
    const { setTitle, info, getTitle } = req.body;

    const getInputType = await input_types.findAll({});
    const getOptionGroup = await option_groups.findAll({});

    if (getTitle === undefined) {
      if (!setTitle || !info) {
        res.statusCode = 400;
        errors = new Error("Semua Field Harus Diisi.");
        return next(errors);
      }
      const createHeader = await quisioner_headers.create({
        quisioner_title: setTitle,
        quisioner_info: info
      });

      return res.status(201).render("admin/manage_quisioner/createQuisionerPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: "Administrator",
        msg: "",
        errorAlert: false,
        reqFooter: true,
        getTitle: "E-Kuisioner || Membuat Kuisioner",
        getHeader: createHeader,
        listInput: getInputType,
        listOption: getOptionGroup,
      });
    } else {
      const getHeader = await quisioner_headers.findOne({
        where: {
          quisioner_title: getTitle,
        }
      });

      return res.render("admin/manage_quisioner/createQuisionerPage", {
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: "Administrator",
        msg: "",
        errorAlert: false,
        reqFooter: true,
        getTitle: "E-Kuisioner || Membuat Kuisioner",
        getHeader: getHeader,
        listInput: getInputType,
        listOption: getOptionGroup,
      });
    }
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.createQuestionHandler = async (req, res, next) => {
  try {
    const { question, input_type, option_group, isAvailable } = req.body;
    const { headerId } = req.params;

    const getInputType = await input_types.findOne({
      where: {
        id: input_type
      }
    });
    const getOptionGroup = await option_groups.findOne({
      where: {
        id: option_group
      }
    });

    if (!getInputType || !getOptionGroup) {
      res.statusCode = 400;
      errors = new Error("Tipe Input / Opsi Grup  Tidak Tersedia, pastikan sesuai dengan pilihan yang tercantum.");
      return next(errors);
    }
    await questions.create({
      QuisionerHeaderId: headerId,
      InputTypeId: getInputType.id,
      question_name: question,
      OptionGroupId: getOptionGroup.id,
      isAvailable: isAvailable
    });
    return res.status(201).redirect("/admin/manage/quisioners");
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.viewQuisionerPage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getHeaders = await quisioner_headers.findAll({});
    const getInputType = await input_types.findAll({});
    const getOptionGroup = await option_groups.findAll({});

    const getQuisioner = await questions.findOne({
      where: {
        id: id
      },
      include: [{
        model: quisioner_headers,
        required: true
      },
      {
        model: input_types,
        required: true
      },
      {
        model: option_groups,
        required: true
      },

      ]
    });

    if (!getQuisioner) {
      res.statusCode = 404;
      errors = new Error(`Kuisioner dengan id:${id} tidak ditemukan`);
      return next(errors);
    }
    return res.render("admin/manage_quisioner/viewQuisionerPage", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: "Administrator",
      reqFooter: true,
      getQuisioner: getQuisioner,
      getHeader: getHeaders,
      getInputType: getInputType,
      getOptionGroup: getOptionGroup,
      msg: "",
      errorAlert: false,
      getTitle: "E-Kuisioner || Detail Kuisioner"
    });

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.updateQuisionerHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updQuisioner = await questions.update(req.body, {
      where: {
        id: id
      }
    });
    if (!updQuisioner) {
      res.statusCode = 404;
      errors = new Error(`Kuisioner dengan id:${id} tidak ditemukan.`);
      return next(errors);
    }
    return res.status(203).redirect("/admin/manage/quisioners");

  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
exports.deleteQuisionerHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delUser = await questions.destroy({
      where: {
        id: id
      }
    });
    if (!delUser) {
      res.statusCode = 404;
      errors = new Error(`Kuisioner dengan id:${id} tidak ditemukan.`);
      return next(errors);
    }
    return res.status(203).redirect("/admin/manage/quisioners");
  } catch (e) {
    res.statusCode = 500;
    errors = new Error(e);
    return next(errors);
  }
};
//! END MANAGE QUISINER HANDLER & PAGE