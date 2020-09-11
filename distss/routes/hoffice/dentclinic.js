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
const jwt_1 = require("../../models/jwt");
const HttpStatus = require("http-status-codes");
const putModel_1 = require("../../models/putModel");
const jwt = new jwt_1.Jwt();
const router = express_1.Router();
const putmodel = new putModel_1.PutModel();
router.post('/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    let tableName = data.tableName;
    let dataInsert = data.formData;
    try {
        let rows = yield putmodel.insertData(db, tableName, dataInsert);
        res.send({ ok: true, rows: rows, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    let tableName = data.tableName;
    let dataUpdate = data.whereName;
    let dataInsert = data.formData;
    try {
        let rows = yield putmodel.updateData(db, tableName, dataUpdate, dataInsert);
        res.send({ ok: true, rows: rows, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
    }
}));
router.post('/del', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    let tableName = data.tableName;
    let dataUpdate = data.whereName;
    try {
        let rows = yield putmodel.deleteData(db, tableName, dataUpdate);
        res.send({ ok: true, rows: rows, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select * from patient limit 10');
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
router.get('/patient/:hn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const key = req.params.key;
    const hn = req.params.hn;
    let sql = '';
    if (hn == 0) {
        sql = `select * from patient`;
    }
    else {
        sql = `select * from patient where hn='${hn}'`;
    }
    console.log(sql);
    try {
        const raw = yield db.raw(sql);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/ohsp/table/:tbl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const tbl = req.params.tbl;
    let sql = `select * from ${tbl}`;
    console.log(sql);
    try {
        const raw = yield db.raw(sql);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/ohspsum/amp/:reportid/:ampcode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const ampcode = req.params.ampcode;
    const reportid = req.params.reportid;
    let sql = `select h.tamboncode ,avg(percent) as pc from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode where o.id='${reportid}' and o.ampcode='${ampcode}' group by tamboncode`;
    try {
        const raw = yield db.raw(sql);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/ohsp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    try {
        const raw = yield db.raw('select * from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/ohsp/:denttopicid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.db1;
    const id = req.params.denttopicid;
    try {
        const raw = yield db.raw(`select * from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode where o.denttopicid = ${id}`);
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
//# sourceMappingURL=dentclinic.js.map