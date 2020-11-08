import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../../models/jwt';

import * as HttpStatus from 'http-status-codes';
import { PutModel } from '../../models/putModel';
const jwt = new Jwt();

const router: Router = Router();
const putmodel = new PutModel();
/* router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
}); */

router.post('/insert', async (req: Request, res: Response) => {
  let db = req.db1;
  // รูปแบบข้อมูล
  // let formData = [{ pname: 'xxxx', lname: 'yyyyy', cid: '4444444' }] //ทดสอบ ฟิวเกิน
  let data = req.body.data;
  let tableName = data.tableName;
  let dataInsert = data.formData;

  try {
    let rows = await putmodel.insertData(db, tableName, dataInsert);
    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
  }
});

router.post('/update', async (req: Request, res: Response) => {
  let db = req.db1;
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
  let dataInsert = data.formData;

  try {
    let rows = await putmodel.updateData(db, tableName, dataUpdate, dataInsert);
    res.send({ ok: true, rows: rows, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
  }
});

router.post('/del', async (req: Request, res: Response) => {
  let db = req.db1;
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

router.get('/ptsearch/:txt', async (req: Request, res: Response) => {
  const db = req.db1;
  const txt:string = req.params.txt;
  const w=txt.substr(0,1);
  const isDigit = parseInt(w);
  let sql:string;
if(isDigit){
  sql=`select * from patient where hn like '${txt}%'`;
}else{
sql=`select * from patient where fname like '${txt}%'`;
}
if(w==" "){
  sql=`select * from patient where lname like '${txt}%'`;
}


  

  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/genmodel/:dtb/:tbl', async (req: Request, res: Response) => {
  const db = req.db1;
  const dtb = req.params.dtb;
  const tbl = req.params.tbl;
  const sql = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${dtb}' AND TABLE_NAME = '${tbl}'`;
  try {
    const raw = await db.raw(sql);
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
  const db = req.db1;
  const key = req.params.key;
  const hn = req.params.hn;
  let sql = '';
  if (hn == 0) {
    sql = `select * from patient`;
  } else {
    sql = `select * from patient where hn='${hn}'`;
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
router.get('/ohsp/table/:tbl', async (req: Request, res: Response) => {
  const db = req.db1;
  const tbl = req.params.tbl;
  //const reportid = req.params.reportid;
  let sql = `select * from ${tbl}`;
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

router.get(
  '/ohspsum/amp/:reportid/:ampcode',
  async (req: Request, res: Response) => {
    const db = req.db1;
    const ampcode = req.params.ampcode;
    const reportid = req.params.reportid;
    let sql = `select h.tamboncode ,avg(percent) as pc from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode where o.id='${reportid}' and o.ampcode='${ampcode}' group by tamboncode`;
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
  }
);
router.get('/ohsp', async (req: Request, res: Response) => {
  const db = req.db1;
  try {
    const raw = await db.raw(
      'select * from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode'
    );
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.get('/ohsp/:denttopicid', async (req: Request, res: Response) => {
  const db = req.db1;
  const id = req.params.denttopicid;
  try {
    const raw = await db.raw(
      `select * from ohsp o INNER JOIN chospital  h  on o.hcode = h.hoscode where o.denttopicid = ${id}`
    );

    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/specpersons', async (req: Request, res: Response) => {
  const db = req.db1;
  try {
    const raw = await db.raw(
      'select * from specperson s inner join hospital h on s.hcode= h.hcode'
    );
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/dentmat', async (req: Request, res: Response) => {
  const db = req.db1;
  try {
    const raw = await db.raw(
      'select  s.*,c.catname,c.catnameth from mainproduct s,co_categories c where s.catid = c.catid limit 10'
    );
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
    // res.send({ ok: false, message: 'Error Connect to Database iscc.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/tableshow', async (req: Request, res: Response) => {
  const db = req.db1;
  const tbl = req.params.tbl;
  try {
    const raw = await db.raw(`SHOW TABLES`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/tableshow/:tbl', async (req: Request, res: Response) => {
  const db = req.db1;
  const tbl = req.params.tbl;
  try {
    const raw = await db.raw(`SHOW FULL COLUMNS FROM ${tbl}`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/kn', async (req: Request, res: Response) => {
  const db = req.db1;
  try {
    const raw = await db('amp_36'); // db.raw('select * from amp_36');
    res.send({ ok: true, message: raw });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.get('/x/:a', async (req: Request, res: Response) => {
  const a = req.params.a;
  const db = req.db1;
  try {
    const raw = await db.raw(`select * from amp_36 where code='${a}'`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.post('/', async (req: Request, res: Response) => {
  const db = req.db1;
  // let data = req.params.data;
  const data = req.body.data;
  try {
    const rows = await db('testnode').insert(data);
    res.send({ ok: true, message: rows });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.post('/dels', async (req: Request, res: Response) => {
  const db = req.db1;
  const data = req.body.data;
  try {
    const rows = await db('testnode').del().where(data);
    res.send({ ok: true, message: rows });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
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
