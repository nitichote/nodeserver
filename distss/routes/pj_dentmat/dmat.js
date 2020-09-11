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
const jwt = new jwt_1.Jwt();
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw('select  s.*,c.catname,c.catnameth from mainproduct s,co_categories c where s.catid = c.catid  limit 1');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database isvv.' });
}));
router.post('/stocksbalance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    console.log(data);
    try {
        let raw = yield db.raw(`
select mid,sum(cutvolumn) cutvolumn,sum(cutprice) cutprice,sum(numstockin) numstockin,sum(pricestockin) pricestockin
,sum(numstockout) numstockout,sum(priceout) priceout
from
(select  mid,cutvolumn,cutprice,0 as numstockin,0 as pricestockin,0 as numstockout,0 as priceout
from cutoffstock where cutdate ='${data.cutdate}'
union select mid,0,0,sum(numstockin) numstockin,sum(pricelot) pricelot,0,0  from tbl_stockin where  datestockin >'${data.cutdate}'
group by mid
union select mid,0,0,0,0,sum(numstockout) numstockout,sum(priceout) priceout from tbl_stockout where  datestockout >'${data.cutdate}'
group by mid  )as xx
group by mid
`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/stocksbalanceget', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    try {
        let raw = yield db.raw(`
select mid,sum(cutvolumn) cutvolumn,sum(cutprice) cutprice,sum(numstockin) numstockin,sum(pricestockin) pricestockin
,sum(numstockout) numstockout,sum(priceout) priceout
from
(select  mid,cutvolumn,cutprice,0 as numstockin,0 as pricestockin,0 as numstockout,0 as priceout
from cutoffstock where cutoffid =1
union select mid,0,0,sum(numstockin) numstockin,sum(pricelot) pricelot,0,0  from tbl_stockin where  datestockin >='2017-10-10'
group by mid
union select mid,0,0,0,0,sum(numstockout) numstockout,sum(priceout) priceout from tbl_stockout where  datestockout >='2017-10-10'
group by mid  )as xx
group by mid
`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/stockout/:datestock/:mid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let datestock = req.params.datestock;
    let mid = req.params.mid;
    let con = '';
    if (mid == '0') {
        con = ` datestockout >'${datestock}' `;
    }
    else {
        con = ` datestockout >'${datestock}' and n.mid=${mid}`;
    }
    try {
        let raw = yield db.raw(`select o.*, s.mname,s.munit,c.catname,c.catnameth from tbl_stockout o,mainproduct s,
      co_categories c where o.mid = s.mid  and s.catid = c.catid  and  ${con} `);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.post('/getdata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    let mycon = '';
    if (data.con != '0') {
        mycon = data.con;
    }
    try {
        let raw = yield db.raw(`select  * from ${data.tbl} where 1=1 ${mycon} `);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/tmpstockins', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw('select  * from tmp_tbl_stockin ');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw('select  * from users ');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/stocks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw('select  s.*,c.catname,c.catnameth from mainproduct s,co_categories c where s.catid = c.catid  ');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
        res.send({ ok: false, message: 'Error Connect to Database iscc.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/stockin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw(`select n.*,p.supname,s.mname from tbl_stockin n inner join mainproduct s
    on n.mid=s.mid inner join co_supplier p on n.supid = p.supid`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
        res.send({ ok: false, message: 'Error Connect to Database iscc.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/stockin/:datestock/:mid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let datestock = req.params.datestock;
    let mid = req.params.mid;
    let con = '';
    if (mid == '0') {
        con = ` datestockin >'${datestock}' `;
    }
    else {
        con = ` datestockin >'${datestock}' and n.mid=${mid}`;
    }
    let sql = `select n.*,p.supname,s.mname from tbl_stockin n inner join mainproduct s
    on n.mid=s.mid inner join co_supplier p on n.supid = p.supid where ${con}`;
    try {
        let raw = yield db.raw(`select n.*,p.supname,s.mname from tbl_stockin n inner join mainproduct s
    on n.mid=s.mid inner join co_supplier p on n.supid = p.supid where ${con}`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/cats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db.raw('select * from co_categories ');
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
        res.send({ ok: false, message: 'Error Connect to Database iscc.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/getco/:tbl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let tbl = req.params.tbl;
    try {
        let raw = yield db.raw(`select * from ${tbl} `);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
        res.send({ ok: false, message: 'Error Connect to Database iscc.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/kn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    try {
        let raw = yield db('amp_36');
        res.send({ ok: true, message: raw });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/x/:a', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let a = req.params.a;
    let db = req.db1;
    try {
        let raw = yield db.raw(`select * from amp_36 where code='${a}'`);
        res.send({ ok: true, message: raw[0] });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.post('/stocks/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    try {
        let rows = yield db('testnode').insert(data);
        res.send({ ok: true, message: rows });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    try {
        let rows = yield db('testnode').del().where(data);
        res.send({ ok: true, message: rows });
    }
    catch (error) {
        res.send({ ok: false, message: 'Error Connect to Database is.' });
    }
    res.send({ ok: false, message: 'Error Connect to Database is.' });
}));
router.get('/gen-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = {
            fullname: 'SATIT RIANPIT',
            username: 'satit',
            id: 1,
        };
        let token = jwt.signApiKey(payload);
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
//# sourceMappingURL=dmat.js.map