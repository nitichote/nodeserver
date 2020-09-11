"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const HttpStatus = require("http-status-codes");
const express = require("express");
const cors = require("cors");
const connection_1 = require("./configs/connection");
const jwt_1 = require("./models/jwt");
const index_1 = require("./routes/index");
const login_1 = require("./routes/login");
const request_1 = require("./routes/request");
const kpi_1 = require("./routes/kpi/kpi");
const updateRoute_1 = require("./routes/updateRoute");
const insertRoute_1 = require("./routes/insertRoute");
const deleteRoute_1 = require("./routes/deleteRoute");
const dentclinic_1 = require("./routes/dentclinic/dentclinic");
const hoffice_1 = require("./routes/hoffice/hoffice");
const app = express();
const connetion = new connection_1.ConnectionModel();
const jwt = new jwt_1.Jwt();
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use((req, res, next) => {
    req.db1 = connetion.db('db_dentclinic');
    req.db2 = connetion.db('db_hoffice');
    req.db3 = connetion.db('db_dentalspec');
    req.db4 = connetion.db('db_dentalspec');
    req.db5 = connetion.db('db_dentalspec');
    next();
});
let checkAuth = (req, res, next) => {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.query && req.query.token) {
        token = req.query.token;
    }
    else {
        token = req.body.token;
    }
    jwt.verify(token).then((decoded) => {
        req.decoded = decoded;
        next();
    }, (err) => {
        return res.send({
            ok: false,
            error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
            code: HttpStatus.UNAUTHORIZED,
        });
    });
};
app.use('/hoffice', hoffice_1.default);
app.use('/dentclinic', dentclinic_1.default);
app.use('/update', updateRoute_1.default);
app.use('/insert', insertRoute_1.default);
app.use('/delete', deleteRoute_1.default);
app.use('/kpi', kpi_1.default);
app.use('/login', login_1.default);
app.use('/api', checkAuth, request_1.default);
app.use('/', index_1.default);
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
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
app.use((req, res, next) => {
    res.status(HttpStatus.NOT_FOUND).json({
        error: {
            ok: false,
            code: HttpStatus.NOT_FOUND,
            error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
        },
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map