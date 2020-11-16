const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const ejsLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const path = require("path");

const app = express();
require("dotenv").config();

const MongoStore = require('connect-mongo')(session);

const db = require("./models/index");
const { job } = require("./helpers/scheduledDelete.helper");

const routes = require("./routes/index.route");
const errorHandler = require("./middlewares/errorHandler.middleware");
const notFound = require("./middlewares/notFound.middeware");
const checkSession = require("./middlewares/checkSession.middleware");
const serverError = require("./middlewares/serverError.middleware");

(async function setup() {

  //!SET CORS & MORGAN
  app.use(cors());

  //!SET HELMET CSP HEADER 
  app.use(helmet());
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF, 'https://kit.fontawesome.com', 'https://fonts.gstatic.com', 'https://ka-f.fontawesome.com', 'https://www.google.com'],
      'script-src': [SELF, INLINE, 'https://stackpath.bootstrapcdn.com', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', 'https://kit.fontawesome.com', 'https://www.google.com', 'https://www.gstatic.com'],
      'style-src': [SELF, INLINE, 'https://cdn.jsdelivr.net', 'https://stackpath.bootstrapcdn.com', 'https://fonts.googleapis.com'],
      'worker-src': [NONE],
      'block-all-mixed-content': true
    }
  }));

  (process.env.NODE_ENV === "production") ? app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 })) : app.use(morgan("dev"));

  //!SET VIEW ENGINE EJS & STATIC FILES
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "./views/"));
  app.use(ejsLayouts);

  (process.env.NODE_ENV === "production") ? app.set("layout", path.join(__dirname, "./views/layouts/layoutProd")) : app.set("layout", path.join(__dirname, "./views/layouts/layoutDev"));

  (process.env.NODE_ENV === "production") ? app.use("/static", express.static(path.join(__dirname, "dist"))) : app.use("/static", express.static(path.join(__dirname, "public")));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //!SET SESSION OPTIONS ,USE ATLAS MONGODB FOR SESSION STORE
  const sessionOptions = {
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 900000, httpOnly: true, },
    store: new MongoStore({
      url: process.env.MONGODB_SESSION_URL,
      ttl: 24 * 60 * 60 //! One Day (if user not yet logout,sessionid will deleted automaticly)
    })
  }
  if (process.env.NODE_ENV === "production") {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
    sessionOptions.cookie.httpOnly = false
  }
  app.use(session(sessionOptions));

  //!PASSPORT INIT & CONFIG
  app.use(passport.initialize());
  app.use(passport.session());
  require("./config/passport.local.config")(passport);

  //!CHECK CONNECTIONS TO DATABASE
  try {
    await db.sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
  } catch (e) {
    console.error("Unable to connect to the database:", e);
    return process.exit(1);
  }

  //!IMPORT ROUTES & MIDDLEWARE 
  app.use("/", routes);
  app.use(checkSession);
  app.use(notFound);
  app.use(errorHandler);
  app.use(serverError);

  //!RUN HELPER
  job.start();

}());

//!RUN SERVER ON PORT 8080 
const server = app.listen(process.env.PORT || 8080, () => {
  let port = server.address().port;
  console.log(`Server is running on port :${port}`);
});
