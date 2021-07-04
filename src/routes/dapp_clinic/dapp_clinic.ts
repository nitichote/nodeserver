import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../../models/jwt';

import * as HttpStatus from 'http-status-codes';
import { PutModel } from '../../models/putModel';
var formidable = require('formidable');
var sharp = require('sharp');
const jwt = new Jwt();
var fs =require('fs');
const router: Router = Router();
const putmodel = new PutModel();
/* router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
}); */



var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
    }
})
var upload = multer({ storage: storage })
router.post('/file', upload.single('file'),(req, res, next) =>{
   // req.files is array of `photos` files
   // req.body will contain the text fields, if there were any
  // const file =req.file;
  console.log(req);
  
});

var uploads = multer({ storage: storage }).array('userfiles', 10);


router.post('/upload', function (req, res) {
  uploads(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json(err);
      }
      
      let uploadedFiles = [];
    
      for(let item of req['files']) {
          uploadedFiles.push({filename: item.originalname});
      }

      // Everything went fine.
      res.json({progress: 100, files: uploadedFiles});
  })
});

router.post('/insertUpdate', async (req: Request, res: Response) => {
  let db = req.db2;
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
  let db = req.db2;
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
  let db = req.db2;
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
  let db = req.db2;
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
router.get('/reportview/:rid', async (req: Request, res: Response) => {
  const db = req.db2;

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
router.post('/sql', async (req: Request, res: Response) => {
  let db = req.db2;
  // รูปแบบข้อมูล
  let data = req.body;

  console.log(data.sql);

let sql = data.sql;
  //let dataUpdate = data.whereName;
 
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.post('/upload', async (req: Request, res: Response) => {
  let db = req.db2;
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
  const db = req.db2;
  try {
    const raw = await db.raw('select * from patient limit 10');
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
  const db = req.db2;
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
router.get('/gsearch/:con/:dname', async (req: Request, res: Response) => {
  const db = req.db2;
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
router.get('/offices', async (req: Request, res: Response) => {
  const db = req.db2;
  let sql = `select * from hospitalcpho where off_type in('03','05','06','07','12','13')`;
  /* if (key == 'amp') {
        sql = 'select ampcode,ampname,avg(percent) as pc from ohsp group by ampcode';
     } */
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/officesCpho', async (req: Request, res: Response) => {
  const db = req.db2;
  let sql = `select * from hospitalcpho where off_type in('01','03','05','06','07','12','13')`;
  /* if (key == 'amp') {
        sql = 'select ampcode,ampname,avg(percent) as pc from ohsp group by ampcode';
     } */
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/officeCpho1/:hcode', async (req: Request, res: Response) => {
  const db = req.db2;
  const hcode = req.params.hcode;
  let sql = `select * from hospitalcpho where off_type in('01','03','05','06','07','12','13') and off_id='${hcode}'` ;
  
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/officesSch', async (req: Request, res: Response) => {
  const db = req.db2;
  let sql = `select h.*,(select count(*)  from schooldata s where s.hcode = h.off_id) as cntSch   from hospitalcpho h where h.off_type in('03','','06','07','12','13')`;
  /* if (key == 'amp') {
        sql = 'select ampcode,ampname,avg(percent) as pc from ohsp group by ampcode';
     } */
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/school/show', async (req: Request, res: Response) => {
  const db = req.db2;
  let sql = `select * from schooldata s inner join ampall a on left(s.tamboncode,4) = a.code inner join hospitalcpho h on s.hcode = h.off_id `;
  /* if (key == 'amp') {
        sql = 'select ampcode,ampname,avg(percent) as pc from ohsp group by ampcode';
     } */
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/schoolenv/show', (req: Request, res: Response) => {
  const db = req.db2;
  
  let sql = `select s.schoolid,s.schname,s.tag,e.ip,e.lastupdate,e.userpin,e.toothbrush,e.isnocoke,e.isnosweet,e.isnocandy,e.rpyear,s.tamboncode,a.code,a.name,h.off_name,s.hcode from (select sc.* from schooldata sc inner join schclass c on sc.schoolid=c.schoolid where  c.m6=0 and sc.schtypecode='1001') s  inner join ampall a on left(s.tamboncode,4) = a.code inner join hospitalcpho h on s.hcode = h.off_id left outer join school_env e on s.schoolid = e.schoolid  and e.rpyear='2563' order by h.off_id,a.code `;
  //let sql = `select s.schoolid,s.schname,s.tag,s.tamboncode,a.code,a.name,h.off_name,s.hcode,e.* from schooldata s inner join ampall a on left(s.tamboncode,4) = a.code inner join hospitalcpho h on s.hcode = h.off_id left outer join school_env e on s.schoolid = e.schoolid and e.rpyear='2563' order by h.off_id,a.code `;
  
  db.raw(sql)
    .then((raw) => {
      res.send({ ok: true, message: raw[0] });
    })
    .catch((err) => {
      res.send({ ok: false, message: err.message });
    });
});

router.get('/tbl/:tbl', async (req: Request, res: Response) => {
  const db = req.db2;
  const tbl = req.params.tbl;
  let sql = `select * from ${tbl} `;
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get('/amp36', async (req: Request, res: Response) => {
  const db = req.db2;
  const tbl = req.params.tbl;
  let sql = `select * from ampall where left(code,2)=36 `;
  try {
    const raw = await db.raw(sql);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
});
router.get(
  '/ohspsum/amp/:reportid/:ampcode',
  async (req: Request, res: Response) => {
    const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
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
  const db = req.db2;
  try {
    const raw = await db.raw(`select * from amp_36 where code='${a}'`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});

router.post('/', async (req: Request, res: Response) => {
  const db = req.db2;
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
  const db = req.db2;
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
