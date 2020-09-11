import * as express from 'express';
import { Router, Request, Response } from 'express';

import * as HttpStatus from 'http-status-codes';
import { PutModel } from '../models/putModel';

const putmodel = new PutModel();
const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
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

export default router;
