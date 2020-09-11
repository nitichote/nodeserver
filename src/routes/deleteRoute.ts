import * as express from 'express';
import { Router, Request, Response } from 'express';

import * as HttpStatus from 'http-status-codes';
import { PutModel } from '../models/putModel';

const putmodel = new PutModel();
const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
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

export default router;
