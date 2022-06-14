import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../../models/jwt';
import * as HttpStatus from 'http-status-codes';
import { PutModel } from '../../models/putModel';
var formidable = require('formidable');
var sharp = require('sharp');
const jwt = new Jwt();

const router: Router = Router();
const putmodel = new PutModel();
/* router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
}); */

router.post('/insertUpdate', async (req: Request, res: Response) => {
  let db = req.db12;
  let data = req.body.data;
  let tableName = data.tableName;
  let dataUpdate = data.whereName;
  let formData = data.formData;
  console.log(data);

  try {
    let rows = await putmodel.insertData(db, tableName, formData);
    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    console.log('okupdate');

    let rows = await putmodel.updateData(db, tableName, dataUpdate, formData);

    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  }
});

router.post('/insert', async (req: Request, res: Response) => {
  let db = req.db12;
  // รูปแบบข้อมูล
  // let formData = [{ pname: 'xxxx', lname: 'yyyyy', cid: '4444444' }] //ทดสอบ ฟิวเกิน
  let data = req.body.data;
  let tableName = data.tableName;
  let dataInsert = data.formData;

  try {
    let rows = await putmodel.insertData(db, tableName, dataInsert);
  //  const raw = await db.raw(` select * from ${tableName} desc limit 1 `);
  // res.send({ ok: true, message: raw[0] });

    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
  }
});

router.post('/update', async (req: Request, res: Response) => {
  let db = req.db12;
  // รูปแบบข้อมูล
  //let formData = [{ id: 2, pname: '755555', lname: '999999' }]
  //let whereUpdate = [{ id: 2 }];
  let data = req.body.data;
  // let data = {
  //     tableName: tablename,
  //     whereUpdate: whereUpdate,
  //     formData: formData
  // };

  // console.log(data);

  let tableName = data.tableName;
  let dataUpdate = data.whereName;
  let formData = data.formData;

  try {
    let rows = await putmodel.updateData(db, tableName, dataUpdate, formData);
    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
  }
});

router.post('/del', async (req: Request, res: Response) => {
  let db = req.db12;
  // รูปแบบข้อมูล
  let data = req.body.data;

  //console.log(data);

  let tableName = data.tableName;
  let dataUpdate = data.whereName;

  try {
    let rows = await putmodel.deleteData(db, tableName, dataUpdate);
    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
  }
});
router.get('/lastid/:tbl/:fd', async (req: Request, res: Response) => {
  const db = req.db12;
  const tbl=req.params.tbl;
  const fd=req.params.fd;
  
  try {
    const raw = await db.raw(` select * from ${tbl} order by  ${fd} desc limit 1 `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.post('/upload', async (req: Request, res: Response) => {
  let db = req.db12;
  // รูปแบบข้อมูล
  let data = req.body.data;
  console.log('รูปแบบข้อมูล');

  //console.log(data);
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      console.log(files);

      let file_name = files.image.name;
      let file_path = files.image.path;
      let new_path = 'c:/d/images/' + file_name;
      sharp(file_path)
        .resize(150)
        .toFile(new_path, (err) => {
          if (!err) {
            res.send({ ok: true });
          } else {
            res.send({ ok: false });
          }
        });
    });
  } catch (err) {
    res.send({ ok: false, err: err.message });
  }
});
router.get('/', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db.raw('select * from contacts limit 10');
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/reportview/:rid', async (req: Request, res: Response) => {
  const db = req.db12;

  const r_id = req.params.rid;
  let sql = '';
  
  try {
    sql = `select * from reportview where r_id=${r_id}`;
    const raw = await db.raw(sql);
const q = raw[0][0]['sql'];
const raw2 = await db.raw(q);

    res.send({ ok: true, message:raw2[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/user', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db.raw(` select * from user `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/user/:uid', async (req: Request, res: Response) => {
  const db = req.db12;
  const uid=req.params.uid;
  try {
    const raw = await db.raw(` select * from user where uid = ${uid} `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});

router.get('/userlast', async (req: Request, res: Response) => {
  const db = req.db12;
  const uid=req.params.uid;
  try {
    const raw = await db.raw(` select * from user desc limit 1 `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});



  


router.get('/patient/:hn', async (req: Request, res: Response) => {
  const db = req.db12;
  const key = req.params.key;
  const hn = req.params.hn;
  let sql = '';
  if (hn == 0) {
    sql = `select * from patient`;
  } else {
    sql = `select * from patient where hn='${hn}'`;
  }

  try {
    const raw = await db.raw(sql);

    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/gsearch/:con/:dname', async (req: Request, res: Response) => {
  const db = req.db12;
  const con = req.params.con;
  const dname = req.params.dname;
  //const reportid = req.params.reportid;
  let sql = `select * from dperson d inner join hospitalcpho h on d.officenow = h.off_id where dname like '%${dname}%'`;
  if (con == 'office') {
    sql = `select * from dperson d inner join hospitalcpho h on d.officenow = h.off_id where h.off_name like  '%${dname}%'`;
  }
  console.log(sql);

  /* if (key == 'amp') {
        sql = 'select ampcode,ampname,avg(percent) as pc from ohsp group by ampcode';
     } */
  try {
    const raw = await db.raw(sql);

    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});



router.get('/tbl/:tbl/:fd/:val', async (req: Request, res: Response) => {
  const db = req.db12;
  const tbl = req.params.tbl;
  const fd = req.params.fd;
  const val = req.params.val;
  let sql = `select * from ${tbl} where  `;
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/tbl/:tbl', async (req: Request, res: Response) => {
  const db = req.db12;
  const tbl = req.params.tbl;
  let sql = `select * from ${tbl} `;
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});


router.get('/tableshow', async (req: Request, res: Response) => {
  const db = req.db12;
  const tbl = req.params.tbl;
  try {
    const raw = await db.raw(`SHOW TABLES`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/tableshow/:tbl', async (req: Request, res: Response) => {
  const db = req.db12;
  const tbl = req.params.tbl;
  try {
    const raw = await db.raw(`SHOW FULL COLUMNS FROM ${tbl}`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/kn', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db('amp_36'); // db.raw('select * from amp_36');
    res.send({ ok: true, message: raw });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.get('/x/:a', async (req: Request, res: Response) => {
  const a = req.params.a;
  const db = req.db12;
  try {
    const raw = await db.raw(`select * from amp_36 where code='${a}'`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.post('/', async (req: Request, res: Response) => {
  const db = req.db12;
  // let data = req.params.data;
  const data = req.body.data;
  try {
    const rows = await db('testnode').insert(data);
    res.send({ ok: true, message: rows });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.post('/dels', async (req: Request, res: Response) => {
  const db = req.db12;
  const data = req.body.data;
  try {
    const rows = await db('testnode').del().where(data);
    res.send({ ok: true, message: rows });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.get('/gen-token', async (req: Request, res: Response) => {
  try {
    const payload = {
      fullname: 'SATIT RIANPIT',
      username: 'satit',
      id: 1,
    };

    const token = jwt.signApiKey(payload);
    res.send({ ok: true, token: token, code: HttpStatus.OK });
  } catch (error) {
    res.send({
      ok: false,
      error: error.message,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
});

export default router;
