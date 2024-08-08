/// <reference path="../typings.d.ts" />

require("dotenv").config();

import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as ejs from "ejs";
import * as HttpStatus from "http-status-codes";
import * as express from "express";
import * as cors from "cors";

import { Router, Request, Response, NextFunction } from "express";
import { ConnectionModel } from "./configs/connection";
import { Jwt } from "./models/jwt";
import { Bcrypt } from "./configs/bcrypt";

import indexRoute from "./routes/index";
import loginRoute from "./routes/login";
import requestRoute from "./routes/request";

import updateRoute from "./routes/updateRoute";
import insertRoute from "./routes/insertRoute";
import deleteRoute from "./routes/deleteRoute";

import dentssjRoute from "./routes/dentssj/dentssj";
import dapp_clinicRoute from "./routes/dentssj/dentssj";

import denticd10tmRoute from "./routes/denticd10tm/denticd10tm";

import dqRoute from "./routes/dq/dq";

import caRoute from "./routes/ca/ca";

// Assign router to the express.Router() instance
const app: express.Application = express();

const connetion = new ConnectionModel();
const jwt = new Jwt();

//view engine setup
app.set("views", path.join(__dirname, "../views"));
app.engine(".ejs", ejs.renderFile);
app.set("view engine", "ejs");

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors("*"));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  req.db1 = await connetion.db("db_dentclinic");
  req.db2 = await connetion.db("db_hoffice");
  req.db3 = await connetion.db("db_dentalspec");
  req.db4 = await connetion.db("db_dentssjclub");
  req.db5 = await connetion.db("db_dentalspec");
  req.db6 = await connetion.db("db_kpirank");
  req.db7 = await connetion.db("db_dent2006");
  req.db8 = await connetion.db("db_cowards");
  req.db9 = await connetion.db("db_icd10tm"); //change coward36
  req.db10 = await connetion.db("db_dentspec");
  req.db11 = await connetion.db("db_dentappoint");
  req.db12 = await connetion.db("db_dps");
  req.db13 = await connetion.db("db_implant");
  req.db14 = await connetion.db("DentalClinicDb");
  req.db15 = await connetion.db("db_oralcancer");
  req.db16 = await connetion.db("db_dq");
  req.bcrypt = new Bcrypt();
  next();
});

let checkAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: string = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token).then(
    (decoded: any) => {
      req.decoded = decoded;
      next();
    },
    (err) => {
      return res.send({
        ok: false,
        error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        code: HttpStatus.UNAUTHORIZED,
      });
    }
  );
};
app.use("/dssj", dqRoute);
app.use("/ca", caRoute);
//app.use('/dps', dpsRoute);
/* 
app.use('/denticd10tm', denticd10tmRoute);

app.use('/dentssj', dentssjRoute);
app.use('/dapp_clinic', dapp_clinicRoute);
app.use('/update', updateRoute);
app.use('/insert', insertRoute);
app.use('/delete', deleteRoute);
app.use('/ca', caRoute);
app.use('/login', loginRoute);
app.use('/api', checkAuth, requestRoute);
app.use('/', indexRoute); */

//error handlers

if (process.env.NODE_ENV === "development") {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      },
    });
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      ok: false,
      code: HttpStatus.NOT_FOUND,
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
    },
  });
});

export default app;
