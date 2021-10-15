/// <reference path="../typings.d.ts" />

require('dotenv').config();

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as HttpStatus from 'http-status-codes';
import * as express from 'express';
import * as cors from 'cors';

import Knex = require('knex');
import { MySqlConnectionConfig } from 'knex';
import { Router, Request, Response, NextFunction } from 'express';
import { ConnectionModel } from './configs/connection';
import { Jwt } from './models/jwt';

import indexRoute from './routes/index';
import loginRoute from './routes/login';
import requestRoute from './routes/request';
import kpiscoreRoute from './routes/kpiscore/kpiscore';
import kpiRoute from './routes/kpi/kpi';
import updateRoute from './routes/updateRoute';
import insertRoute from './routes/insertRoute';
import deleteRoute from './routes/deleteRoute';
import dentclinicRoute from './routes/dentclinic/dentclinic';
import hofficeRoute from './routes/hoffice/hoffice';
import dentssjRoute from './routes/dentssj/dentssj';
import dapp_clinicRoute from './routes/dentssj/dentssj';
import gisspaceRoute from './routes/gisspace/gisspace';
import capp2006Route from './routes/capp2006/capp2006';
import cowardRoute from './routes/coward/coward';
import coward36Route from './routes/coward36/coward36';
import dente5gRoute from './routes/dente5g/dente5g';
// Assign router to the express.Router() instance
const app: express.Application = express();

const connetion = new ConnectionModel();
const jwt = new Jwt();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db1 = connetion.db('db_dentclinic');
  req.db2 = connetion.db('db_hoffice');
  req.db3 = connetion.db('db_dentalspec');
  req.db4 = connetion.db('db_dentssjclub');
  req.db5 = connetion.db('db_dentalspec');
  req.db6 = connetion.db('db_kpirank');
  req.db7 = connetion.db('db_dent2006');
  req.db8 = connetion.db('db_cowards');
  req.db9 = connetion.db('db_coward36');
  req.db10 = connetion.db('db_dentspec');
  next();
});

let checkAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: string = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1];
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
app.use('/dente5g', dente5gRoute);
app.use('/coward36', coward36Route);
app.use('/coward', cowardRoute);
app.use('/capp2006', capp2006Route);
app.use('/kpiscore', kpiscoreRoute);
app.use('/gisspace', gisspaceRoute);
app.use('/dentssj', dentssjRoute);
app.use('/hoffice', hofficeRoute);
app.use('/dentclinic', dentclinicRoute);
app.use('/dapp_clinic', dapp_clinicRoute);
app.use('/update', updateRoute);
app.use('/insert', insertRoute);
app.use('/delete', deleteRoute);

app.use('/kpi', kpiRoute);
app.use('/login', loginRoute);
app.use('/api', checkAuth, requestRoute);
app.use('/', indexRoute);

//error handlers

if (process.env.NODE_ENV === 'development') {
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


