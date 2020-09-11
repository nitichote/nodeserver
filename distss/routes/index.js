"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../models/jwt");
const HttpStatus = require("http-status-codes");
const jwt = new jwt_1.Jwt();
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select * from specperson s inner join hospital h on s.hcode= h.hcode limit 10');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({
            ok: false,
            message: 'there is an Error Connect to Database is.no ok',
        });
    }
    res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
}));
router.get('/specname', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select * from specname');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/specpersons', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select * from specperson s inner join hospital h on s.hcode= h.hcode');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/dentmat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select  s.*,c.catname,c.catnameth from mainproduct s,co_categories c where s.catid = c.catid limit 10');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
        res.send({ ok: false, message: 'Error Connect to Database iscc.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/tableshow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const tbl = req.params.tbl;
    try {
        const raw = yield db.raw(`SHOW TABLES`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/tableshow/:tbl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const tbl = req.params.tbl;
    try {
        const raw = yield db.raw(`SHOW FULL COLUMNS FROM ${tbl}`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/kn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db('amp_36');
        res.send({ ok: true, message: raw });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/x/:a', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const a = req.params.a;
    const db = req.db1;
    try {
        const raw = yield db.raw(`select * from amp_36 where code='${a}'`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const data = req.body.data;
    try {
        const rows = yield db('testnode').insert(data);
        res.send({ ok: true, message: rows });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.post('/dels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const data = req.body.data;
    try {
        const rows = yield db('testnode').del().where(data);
        res.send({ ok: true, message: rows });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/gen-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            fullname: 'SATIT RIANPIT',
            username: 'satit',
            id: 1,
        };
        const token = jwt.signApiKey(payload);
        res.send({ ok: true, token: token, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({
            ok: false,
            error: error.message,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map