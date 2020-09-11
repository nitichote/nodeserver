import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../../models/jwt';

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();

const router: Router = Router();

/* router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
}); */

router.get('/', async (req: Request, res: Response) => {
  const db = req.db1;
  try {
    const raw = await db.raw(
      'select * from specperson s inner join hospital h on s.hcode= h.hcode limit 10'
    );
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({
      ok: false,
      message: 'there is an Error Connect to Database is.no ok',
    });
  }
  res.send({ ok: false, message: 'ok Error Connect to Database isvv.' });
});
router.get('/ohspsum/ampall/:reportid', async (req: Request, res: Response) => {
  const db = req.db1;
  const key = req.params.key;
  const reportid = req.params.reportid;
  let sql = `select ampcode,ampname,avg(percent) as pc from ohsp where id= '${reportid}' group by ampcode`;
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
    res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
    res.send({ ok: false, message: 'Error Connect to Database iscc.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
});
router.get('/kn', async (req: Request, res: Response) => {
  const db = req.db1;
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
  const db = req.db1;
  try {
    const raw = await db.raw(`select * from amp_36 where code='${a}'`);
    res.send({ ok: true, message: raw[0] });
  } catch (error) {
    res.send({ ok: false, message: 'Error Connect to Database is.' });
  }
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
  res.send({ ok: false, message: 'Error Connect to Database is.' });
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
