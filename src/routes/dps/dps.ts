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
  const tbl = req.params.tbl;
  const fd = req.params.fd;

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

    res.send({ ok: true, message: raw2[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.no ok' });
  }
  // res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/tbconf', async (req: Request, res: Response) => {
  const db = req.db12;
 
    res.send({ ok: true, message: {
      "pagingType": "full_numbers",
      "pageLength": 2
    } });
  
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/data', async (req: Request, res: Response) => {
  res.send(

    {
      "data": [
        {
          "id": 860,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 870,
          "firstName": "Foo",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 590,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 803,
          "firstName": "Luke",
          "lastName": "Kyle"
        },
        {
          "id": 474,
          "firstName": "Toto",
          "lastName": "Bar"
        },
        {
          "id": 476,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 464,
          "firstName": "Cartman",
          "lastName": "Kyle"
        },
        {
          "id": 505,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 308,
          "firstName": "Louis",
          "lastName": "Kyle"
        },
        {
          "id": 184,
          "firstName": "Toto",
          "lastName": "Bar"
        },
        {
          "id": 411,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 154,
          "firstName": "Luke",
          "lastName": "Moliku"
        },
        {
          "id": 623,
          "firstName": "Someone First Name",
          "lastName": "Moliku"
        },
        {
          "id": 499,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 482,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 255,
          "firstName": "Louis",
          "lastName": "Kyle"
        },
        {
          "id": 772,
          "firstName": "Zed",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 398,
          "firstName": "Zed",
          "lastName": "Moliku"
        },
        {
          "id": 840,
          "firstName": "Superman",
          "lastName": "Lara"
        },
        {
          "id": 894,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 591,
          "firstName": "Luke",
          "lastName": "Titi"
        },
        {
          "id": 767,
          "firstName": "Luke",
          "lastName": "Moliku"
        },
        {
          "id": 133,
          "firstName": "Cartman",
          "lastName": "Moliku"
        },
        {
          "id": 274,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 996,
          "firstName": "Superman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 780,
          "firstName": "Batman",
          "lastName": "Kyle"
        },
        {
          "id": 931,
          "firstName": "Batman",
          "lastName": "Moliku"
        },
        {
          "id": 326,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 318,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 434,
          "firstName": "Zed",
          "lastName": "Bar"
        },
        {
          "id": 480,
          "firstName": "Toto",
          "lastName": "Kyle"
        },
        {
          "id": 187,
          "firstName": "Someone First Name",
          "lastName": "Bar"
        },
        {
          "id": 829,
          "firstName": "Cartman",
          "lastName": "Bar"
        },
        {
          "id": 937,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 355,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 258,
          "firstName": "Someone First Name",
          "lastName": "Moliku"
        },
        {
          "id": 826,
          "firstName": "Cartman",
          "lastName": "Yoda"
        },
        {
          "id": 586,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 32,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 676,
          "firstName": "Batman",
          "lastName": "Kyle"
        },
        {
          "id": 403,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 222,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 507,
          "firstName": "Zed",
          "lastName": "Someone Last Name"
        },
        {
          "id": 135,
          "firstName": "Superman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 818,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 321,
          "firstName": "Luke",
          "lastName": "Kyle"
        },
        {
          "id": 187,
          "firstName": "Cartman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 327,
          "firstName": "Toto",
          "lastName": "Bar"
        },
        {
          "id": 187,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 417,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 97,
          "firstName": "Zed",
          "lastName": "Bar"
        },
        {
          "id": 710,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 975,
          "firstName": "Toto",
          "lastName": "Yoda"
        },
        {
          "id": 926,
          "firstName": "Foo",
          "lastName": "Bar"
        },
        {
          "id": 976,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 680,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 275,
          "firstName": "Louis",
          "lastName": "Kyle"
        },
        {
          "id": 742,
          "firstName": "Foo",
          "lastName": "Someone Last Name"
        },
        {
          "id": 598,
          "firstName": "Zed",
          "lastName": "Lara"
        },
        {
          "id": 113,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 228,
          "firstName": "Superman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 820,
          "firstName": "Cartman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 700,
          "firstName": "Cartman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 556,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 687,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 794,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 349,
          "firstName": "Someone First Name",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 283,
          "firstName": "Batman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 862,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 674,
          "firstName": "Cartman",
          "lastName": "Bar"
        },
        {
          "id": 954,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 243,
          "firstName": "Superman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 578,
          "firstName": "Superman",
          "lastName": "Lara"
        },
        {
          "id": 660,
          "firstName": "Batman",
          "lastName": "Bar"
        },
        {
          "id": 653,
          "firstName": "Luke",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 583,
          "firstName": "Toto",
          "lastName": "Moliku"
        },
        {
          "id": 321,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 171,
          "firstName": "Superman",
          "lastName": "Kyle"
        },
        {
          "id": 41,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 704,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 344,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 840,
          "firstName": "Toto",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 476,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 644,
          "firstName": "Superman",
          "lastName": "Moliku"
        },
        {
          "id": 359,
          "firstName": "Superman",
          "lastName": "Moliku"
        },
        {
          "id": 856,
          "firstName": "Luke",
          "lastName": "Lara"
        },
        {
          "id": 760,
          "firstName": "Foo",
          "lastName": "Someone Last Name"
        },
        {
          "id": 432,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 299,
          "firstName": "Superman",
          "lastName": "Kyle"
        },
        {
          "id": 693,
          "firstName": "Foo",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 11,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 305,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 961,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 54,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 734,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 466,
          "firstName": "Cartman",
          "lastName": "Titi"
        },
        {
          "id": 439,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 995,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 878,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 479,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 252,
          "firstName": "Cartman",
          "lastName": "Moliku"
        },
        {
          "id": 355,
          "firstName": "Zed",
          "lastName": "Moliku"
        },
        {
          "id": 355,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 694,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 882,
          "firstName": "Cartman",
          "lastName": "Yoda"
        },
        {
          "id": 620,
          "firstName": "Luke",
          "lastName": "Lara"
        },
        {
          "id": 390,
          "firstName": "Superman",
          "lastName": "Lara"
        },
        {
          "id": 247,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 510,
          "firstName": "Batman",
          "lastName": "Moliku"
        },
        {
          "id": 510,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 472,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 533,
          "firstName": "Someone First Name",
          "lastName": "Kyle"
        },
        {
          "id": 725,
          "firstName": "Superman",
          "lastName": "Kyle"
        },
        {
          "id": 221,
          "firstName": "Zed",
          "lastName": "Lara"
        },
        {
          "id": 302,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 755,
          "firstName": "Louis",
          "lastName": "Someone Last Name"
        },
        {
          "id": 671,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 649,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 22,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 544,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 114,
          "firstName": "Someone First Name",
          "lastName": "Titi"
        },
        {
          "id": 674,
          "firstName": "Someone First Name",
          "lastName": "Lara"
        },
        {
          "id": 571,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 554,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 203,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 89,
          "firstName": "Luke",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 299,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 48,
          "firstName": "Toto",
          "lastName": "Bar"
        },
        {
          "id": 726,
          "firstName": "Batman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 121,
          "firstName": "Toto",
          "lastName": "Bar"
        },
        {
          "id": 992,
          "firstName": "Superman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 551,
          "firstName": "Toto",
          "lastName": "Kyle"
        },
        {
          "id": 831,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 940,
          "firstName": "Luke",
          "lastName": "Moliku"
        },
        {
          "id": 974,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 579,
          "firstName": "Luke",
          "lastName": "Moliku"
        },
        {
          "id": 752,
          "firstName": "Cartman",
          "lastName": "Yoda"
        },
        {
          "id": 873,
          "firstName": "Batman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 939,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 240,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 969,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 247,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 3,
          "firstName": "Cartman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 154,
          "firstName": "Batman",
          "lastName": "Bar"
        },
        {
          "id": 274,
          "firstName": "Toto",
          "lastName": "Someone Last Name"
        },
        {
          "id": 31,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 789,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 634,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 972,
          "firstName": "Toto",
          "lastName": "Kyle"
        },
        {
          "id": 199,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 562,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 460,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 817,
          "firstName": "Cartman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 307,
          "firstName": "Cartman",
          "lastName": "Bar"
        },
        {
          "id": 10,
          "firstName": "Cartman",
          "lastName": "Titi"
        },
        {
          "id": 167,
          "firstName": "Toto",
          "lastName": "Someone Last Name"
        },
        {
          "id": 107,
          "firstName": "Cartman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 432,
          "firstName": "Batman",
          "lastName": "Kyle"
        },
        {
          "id": 381,
          "firstName": "Luke",
          "lastName": "Yoda"
        },
        {
          "id": 517,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 575,
          "firstName": "Superman",
          "lastName": "Kyle"
        },
        {
          "id": 716,
          "firstName": "Cartman",
          "lastName": "Titi"
        },
        {
          "id": 646,
          "firstName": "Foo",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 144,
          "firstName": "Someone First Name",
          "lastName": "Yoda"
        },
        {
          "id": 306,
          "firstName": "Luke",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 395,
          "firstName": "Luke",
          "lastName": "Bar"
        },
        {
          "id": 777,
          "firstName": "Toto",
          "lastName": "Moliku"
        },
        {
          "id": 624,
          "firstName": "Louis",
          "lastName": "Someone Last Name"
        },
        {
          "id": 994,
          "firstName": "Superman",
          "lastName": "Moliku"
        },
        {
          "id": 653,
          "firstName": "Batman",
          "lastName": "Moliku"
        },
        {
          "id": 198,
          "firstName": "Foo",
          "lastName": "Bar"
        },
        {
          "id": 157,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 955,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 339,
          "firstName": "Foo",
          "lastName": "Bar"
        },
        {
          "id": 552,
          "firstName": "Batman",
          "lastName": "Titi"
        },
        {
          "id": 735,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 294,
          "firstName": "Batman",
          "lastName": "Bar"
        },
        {
          "id": 287,
          "firstName": "Someone First Name",
          "lastName": "Bar"
        },
        {
          "id": 399,
          "firstName": "Cartman",
          "lastName": "Yoda"
        },
        {
          "id": 741,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 670,
          "firstName": "Foo",
          "lastName": "Bar"
        },
        {
          "id": 260,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 294,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 294,
          "firstName": "Zed",
          "lastName": "Lara"
        },
        {
          "id": 840,
          "firstName": "Zed",
          "lastName": "Titi"
        },
        {
          "id": 448,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 260,
          "firstName": "Luke",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 119,
          "firstName": "Zed",
          "lastName": "Someone Last Name"
        },
        {
          "id": 702,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 87,
          "firstName": "Zed",
          "lastName": "Someone Last Name"
        },
        {
          "id": 161,
          "firstName": "Foo",
          "lastName": "Lara"
        },
        {
          "id": 404,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 871,
          "firstName": "Toto",
          "lastName": "Lara"
        },
        {
          "id": 908,
          "firstName": "Someone First Name",
          "lastName": "Moliku"
        },
        {
          "id": 484,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 966,
          "firstName": "Cartman",
          "lastName": "Titi"
        },
        {
          "id": 392,
          "firstName": "Someone First Name",
          "lastName": "Lara"
        },
        {
          "id": 738,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 560,
          "firstName": "Louis",
          "lastName": "Kyle"
        },
        {
          "id": 507,
          "firstName": "Zed",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 660,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 929,
          "firstName": "Superman",
          "lastName": "Moliku"
        },
        {
          "id": 42,
          "firstName": "Batman",
          "lastName": "Moliku"
        },
        {
          "id": 853,
          "firstName": "Luke",
          "lastName": "Titi"
        },
        {
          "id": 977,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 104,
          "firstName": "Toto",
          "lastName": "Kyle"
        },
        {
          "id": 820,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 187,
          "firstName": "Batman",
          "lastName": "Titi"
        },
        {
          "id": 524,
          "firstName": "Louis",
          "lastName": "Yoda"
        },
        {
          "id": 830,
          "firstName": "Cartman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 156,
          "firstName": "Someone First Name",
          "lastName": "Lara"
        },
        {
          "id": 918,
          "firstName": "Foo",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 286,
          "firstName": "Batman",
          "lastName": "Moliku"
        },
        {
          "id": 715,
          "firstName": "Louis",
          "lastName": "Kyle"
        },
        {
          "id": 501,
          "firstName": "Superman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 463,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 419,
          "firstName": "Toto",
          "lastName": "Yoda"
        },
        {
          "id": 752,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 754,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 497,
          "firstName": "Someone First Name",
          "lastName": "Kyle"
        },
        {
          "id": 722,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 986,
          "firstName": "Batman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 908,
          "firstName": "Someone First Name",
          "lastName": "Titi"
        },
        {
          "id": 559,
          "firstName": "Superman",
          "lastName": "Bar"
        },
        {
          "id": 816,
          "firstName": "Foo",
          "lastName": "Bar"
        },
        {
          "id": 517,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 188,
          "firstName": "Superman",
          "lastName": "Bar"
        },
        {
          "id": 762,
          "firstName": "Batman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 872,
          "firstName": "Batman",
          "lastName": "Titi"
        },
        {
          "id": 107,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 968,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 643,
          "firstName": "Toto",
          "lastName": "Someone Last Name"
        },
        {
          "id": 88,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 844,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 334,
          "firstName": "Batman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 43,
          "firstName": "Zed",
          "lastName": "Lara"
        },
        {
          "id": 600,
          "firstName": "Someone First Name",
          "lastName": "Kyle"
        },
        {
          "id": 719,
          "firstName": "Luke",
          "lastName": "Lara"
        },
        {
          "id": 698,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 994,
          "firstName": "Zed",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 595,
          "firstName": "Someone First Name",
          "lastName": "Someone Last Name"
        },
        {
          "id": 223,
          "firstName": "Toto",
          "lastName": "Yoda"
        },
        {
          "id": 392,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 972,
          "firstName": "Toto",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 155,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 956,
          "firstName": "Louis",
          "lastName": "Yoda"
        },
        {
          "id": 62,
          "firstName": "Foo",
          "lastName": "Kyle"
        },
        {
          "id": 689,
          "firstName": "Superman",
          "lastName": "Titi"
        },
        {
          "id": 46,
          "firstName": "Foo",
          "lastName": "Someone Last Name"
        },
        {
          "id": 401,
          "firstName": "Toto",
          "lastName": "Someone Last Name"
        },
        {
          "id": 658,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 375,
          "firstName": "Someone First Name",
          "lastName": "Bar"
        },
        {
          "id": 877,
          "firstName": "Toto",
          "lastName": "Someone Last Name"
        },
        {
          "id": 923,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 37,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 416,
          "firstName": "Cartman",
          "lastName": "Yoda"
        },
        {
          "id": 546,
          "firstName": "Zed",
          "lastName": "Yoda"
        },
        {
          "id": 282,
          "firstName": "Luke",
          "lastName": "Lara"
        },
        {
          "id": 943,
          "firstName": "Superman",
          "lastName": "Yoda"
        },
        {
          "id": 319,
          "firstName": "Foo",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 390,
          "firstName": "Louis",
          "lastName": "Lara"
        },
        {
          "id": 556,
          "firstName": "Luke",
          "lastName": "Kyle"
        },
        {
          "id": 255,
          "firstName": "Cartman",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 80,
          "firstName": "Zed",
          "lastName": "Kyle"
        },
        {
          "id": 760,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 291,
          "firstName": "Louis",
          "lastName": "Titi"
        },
        {
          "id": 916,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 212,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 445,
          "firstName": "Luke",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 101,
          "firstName": "Someone First Name",
          "lastName": "Someone Last Name"
        },
        {
          "id": 565,
          "firstName": "Superman",
          "lastName": "Kyle"
        },
        {
          "id": 304,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 557,
          "firstName": "Foo",
          "lastName": "Titi"
        },
        {
          "id": 544,
          "firstName": "Toto",
          "lastName": "Kyle"
        },
        {
          "id": 244,
          "firstName": "Zed",
          "lastName": "Titi"
        },
        {
          "id": 464,
          "firstName": "Someone First Name",
          "lastName": "Bar"
        },
        {
          "id": 225,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 727,
          "firstName": "Superman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 735,
          "firstName": "Louis",
          "lastName": "Bar"
        },
        {
          "id": 334,
          "firstName": "Foo",
          "lastName": "Lara"
        },
        {
          "id": 982,
          "firstName": "Batman",
          "lastName": "Kyle"
        },
        {
          "id": 48,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 175,
          "firstName": "Luke",
          "lastName": "Moliku"
        },
        {
          "id": 885,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 675,
          "firstName": "Toto",
          "lastName": "Moliku"
        },
        {
          "id": 47,
          "firstName": "Superman",
          "lastName": "Someone Last Name"
        },
        {
          "id": 105,
          "firstName": "Toto",
          "lastName": "Titi"
        },
        {
          "id": 616,
          "firstName": "Cartman",
          "lastName": "Lara"
        },
        {
          "id": 134,
          "firstName": "Someone First Name",
          "lastName": "Someone Last Name"
        },
        {
          "id": 26,
          "firstName": "Foo",
          "lastName": "Moliku"
        },
        {
          "id": 134,
          "firstName": "Toto",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 680,
          "firstName": "Zed",
          "lastName": "Lara"
        },
        {
          "id": 208,
          "firstName": "Luke",
          "lastName": "Someone Last Name"
        },
        {
          "id": 233,
          "firstName": "Someone First Name",
          "lastName": "Moliku"
        },
        {
          "id": 131,
          "firstName": "Louis",
          "lastName": "Moliku"
        },
        {
          "id": 87,
          "firstName": "Toto",
          "lastName": "Yoda"
        },
        {
          "id": 356,
          "firstName": "Batman",
          "lastName": "Kyle"
        },
        {
          "id": 39,
          "firstName": "Louis",
          "lastName": "Whateveryournameis"
        },
        {
          "id": 867,
          "firstName": "Batman",
          "lastName": "Lara"
        },
        {
          "id": 382,
          "firstName": "Someone First Name",
          "lastName": "Bar"
        }
      ]
    }

  );
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
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
  const uid = req.params.uid;
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
router.get('/personlast', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db.raw(` 
    select p.*, s.positionname,h.hosname,h.splevel as hlevel,h.hostype,h.pvcode as pvcodename,h.cup,h.hareacode,h.ampurcode as ampurcodename,t.statusname,d.specname,dt.denttypename ,l.slevelname ,
    CONCAT(d.specname," ",l.slevelname) as speclevelname,
    CASE WHEN p.gender=1 THEN 'ชาย'
     WHEN  p.gender=2  THEN 'หญิง'
     ELSE '-' END AS gendername
from s_persons p 
left join hospitalr9 h on p.hcode = h.hcode 
LEFT JOIN position s on  p.pos_id = s.position_id
LEFT JOIN pstatus t on  p.status_id= t.status_id
left join specdomain d on p.domain_id = d.domain_id
left join denttype dt on p.dtype_id = dt.denttype_id
left join speclevel l on p.level_id = l.level_id order by p.dn_id desc limit 1
     `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/persons', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db.raw(` 
    select p.*, s.positionname,h.hosname,h.splevel as hlevel,h.hostype,h.pvcode as pvcodename,h.cup,h.hareacode,h.ampurcode as ampurcodename,t.statusname,d.specname,dt.denttypename ,l.slevelname ,
    CONCAT(d.specname," ",l.slevelname) as speclevelname,
    CASE WHEN p.gender=1 THEN 'ชาย'
     WHEN  p.gender=2  THEN 'หญิง'
     ELSE '-' END AS gendername
from s_persons p 
left join hospitalr9 h on p.hcode = h.hcode 
LEFT JOIN position s on  p.pos_id = s.position_id
LEFT JOIN pstatus t on  p.status_id= t.status_id
left join specdomain d on p.domain_id = d.domain_id
left join denttype dt on p.dtype_id = dt.denttype_id
left join speclevel l on p.level_id = l.level_id  order by p.dn_id desc
     `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/psreport', async (req: Request, res: Response) => {
  const db = req.db12;
  try {
    const raw = await db.raw(` 
    select  r.hcode,r.hosname, r.specname, r.level_id,r.domain_id,r.status_id, r.slevelname,r.statusname,count(r.dn_id) amt  from 
    (select p.dentname AS dentname,p.dnote AS dnote,p.hcode AS hcode,p.pos_id AS pos_id,p.domain_id AS domain_id,p.dtype_id AS dtype_id,p.level_id AS level_id,p.status_id AS status_id,p.yearla AS yearla,p.yearfinish AS yearfinish,p.pvcode AS pvcode,p.dn_id AS dn_id,p.yearretire AS yearretire,p.yearwork AS yearwork,p.gender AS gender,p.yearhosstart AS yearhosstart,p.yearhosend AS yearhosend,s.positionname AS positionname,h.hosname AS hosname,h.splevel AS hlevel,h.hostype AS hostype,h.pvcode AS pvcodename,h.cup AS cup,h.hareacode AS hareacode,h.ampurcode AS ampurcodename,t.statusname AS statusname,d.specname AS specname,dt.denttypename AS denttypename,l.slevelname AS slevelname,concat(d.specname,' ',l.slevelname) AS speclevelname,(case when (p.gender = 1) then 'ชาย' when (p.gender = 2) then 'หญิง' else '-' end) AS gendername from ((((((s_persons p left join hospitalr9 h on((p.hcode = h.hcode))) left join position s on((p.pos_id = s.position_id))) left join pstatus t on((p.status_id = t.status_id))) left join specdomain d on((p.domain_id = d.domain_id))) left join denttype dt on((p.dtype_id = dt.denttype_id))) left join speclevel l on((p.level_id = l.level_id))) order by p.dn_id) r  
    GROUP BY r.hosname, r.specname ,r.slevelname ,r.statusname     `);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  // res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/person/:id', async (req: Request, res: Response) => {
  const db = req.db12;
  const dn_id = req.params.id;
  try {
    const raw = await db.raw(` 
    select p.*, s.positionname,h.hosname,h.splevel as hlevel,h.hostype,h.pvcode as pvcodename,h.cup,h.hareacode,h.ampurcode as ampurcodename,t.statusname,d.specname,dt.denttypename ,l.slevelname ,
    CONCAT(d.specname," ",l.slevelname) as speclevelname,
    CASE WHEN p.gender=1 THEN 'ชาย'
     WHEN  p.gender=2  THEN 'หญิง'
     ELSE '-' END AS gendername
from s_persons p 
left join hospitalr9 h on p.hcode = h.hcode 
LEFT JOIN position s on  p.pos_id = s.position_id
LEFT JOIN pstatus t on  p.status_id= t.status_id
left join specdomain d on p.domain_id = d.domain_id
left join denttype dt on p.dtype_id = dt.denttype_id
left join speclevel l on p.level_id = l.level_id
 where dn_id=${dn_id}    `);
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
  const uid = req.params.uid;
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
