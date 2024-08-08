import * as express from "express";
import { Router, Request, Response } from "express";
import * as path from "path";
import * as HttpStatus from "http-status-codes";
import Knex = require("knex");
import * as multer from "multer";
import * as fs from "fs-extra";
import * as jwt from "jsonwebtoken";
import { PutModel } from "../../models/putModel";
import { log } from "console";
const router: Router = Router();
const putmodel = new PutModel();
const bcrypt = require("bcrypt");
//const bodyParser = require("body-parser");
const axios = require("axios");
const SECRET_KEY = "12345";
//router.use(bodyParser.json());
const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";
const LINE_TOKEN = "JYDsgj6aGqGIb2r0ACEDI1JwvB9BWHKqyNgYLzqCWYu";
router.post("/send-line-notify", (req: Request, res: Response) => {
  const message = req.body.message;

  axios
    .post(LINE_NOTIFY_API, `message=${message}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${LINE_TOKEN}`,
      },
    })
    .then((response) => {
      res.status(200).json({
        message: "Notification sent successfully",
        response: response.data,
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error sending notification", error: error.message });
    });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const { cid } = JSON.parse(req.body.cancer);
      const dir = path.join(__dirname, "assets", "imgupload", cid);
      fs.ensureDirSync(dir);
      cb(null, dir);
    } catch (error) {
      cb(new Error("Invalid request body"), "");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
function decodeId(encodedId) {
  return Buffer.from(encodedId, "base64").toString("ascii");
}
const upload = multer({ storage: storage });

// Middleware to verify JWT
const verifyToken = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.decoded = decoded;
    next();
  } catch (ex) {
    res.status(HttpStatus.UNAUTHORIZED).send("Invalid token.");
  }
};
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // console.log("user=", username);
  let db = req.db15;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await db("user").where({ username, password }).first();

    if (user) {
      //  console.log("user=", user);
      // Assuming you are returning a token, for simplicity a static token is returned
      return res.status(200).json({
        token: "your-token",
        user: {
          hcode: user.hcode,
          hname: user.hname,
          realname: user.realname,
          username: user.username,
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/ptcount", async (req: Request, res: Response) => {
  const db = req.db15;
  try {
    const rows = await db("tblcancer as q").count("* as count");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/icd10cancer", async (req: Request, res: Response) => {
  const db = req.db15;
  try {
    const rows = await db("icd10cancer as q").select("q.*");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/biopsycode", async (req: Request, res: Response) => {
  const db = req.db15;
  try {
    const rows = await db("biopsycode as q").select("q.*");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/ltc/cid", async (req: Request, res: Response) => {
  const db = req.db15;
  const cid = req.query.cid;
  try {
    const rows = await db("ltc as q")
      .select(
        "q.*",
        db.raw("left(q.ltcdate,10) as ltcdate"),
        "h.off_name as hname"
      )
      .leftJoin("hospital36 as h", "q.ltchcode", "h.off_id")
      .where("q.cid", "=", cid);
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/cacode/codetype", async (req: Request, res: Response) => {
  const db = req.db15;
  const codetype = req.query.codetype;
  try {
    const rows = await db("cacode as q")
      .select("q.*")
      .where("q.codetype", "=", codetype);
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/hosocancer", async (req: Request, res: Response) => {
  const db = req.db15;
  try {
    const rows = await db("hosocancer as q").select("q.*");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/pts/hcode", async (req: Request, res: Response) => {
  const db = req.db15;
  const hcode = req.query.hcode; // Assuming 'hcode' is passed as a query parameter

  try {
    let query = db("tblcancer as q")
      .select(
        "q.*",
        db.raw("left(q.registdate,10) as registdate"),
        db.raw("left(q.biopsydate,10) as biopsydate"),
        db.raw("left(q.centercaredate,10) as centercaredate"),
        db.raw("left(q.dischargedate,10) as dischargedate"),
        "h.off_name as hname",
        "b.off_name as biopsyhname",
        "c.off_name as carehname",
        "cns.off_name as consultbiopsyhname",
        "t.off_name as txpmdshname",
        "bi.codename as txbname",
        "dxi.icdname as dxiname",
        "dxb.icdname as dxbname"
      )
      .leftJoin("hospital36 as h", "q.hcode", "h.off_id")
      .leftJoin("hospital36 as b", "q.biopsyhcode", "b.off_id")
      .leftJoin("hospital36 as cns", "q.consultbiopsyhcode", "cns.off_id")
      .leftJoin("hospital36 as c", "q.carehcode", "c.off_id")
      .leftJoin("hospital36 as t", "q.txpmdshcode", "t.off_id")
      .leftJoin("biopsycode as bi", "q.tx_biopsy", "bi.code")
      .leftJoin("icd10cancer as dxi", "q.dx_ini", "dxi.icdcode")
      .leftJoin("icd10cancer as dxb", "q.dx_biopsy", "dxb.icdcode");

    if (hcode !== "00024") {
      query = query
        .where("q.hcode", "=", hcode)
        .orWhere("q.biopsyhcode", "=", hcode)
        .orWhere("q.txpmdshcode", "=", hcode)
        .orWhere("q.consultbiopsyhcode", "=", hcode)
        .orWhere("q.carehcode", "=", hcode);
    }

    const rows = await query.orderBy("q.row_id", "desc");
    res.send({ ok: true, rows });
    // console.log("rows: ", rows);
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});

router.get("/pts/cid", async (req: Request, res: Response) => {
  const db = req.db15;
  const cid = req.query.cid; // Assuming 'hcode' is passed as a query parameter

  try {
    const rows = await db("tblcancer as q")
      .select(
        "q.*",
        db.raw("left(q.registdate,10) as registdate"),
        db.raw("left(q.biopsydate,10) as biopsydate"),
        db.raw("left(q.centercaredate,10) as centercaredate"),
        db.raw("left(q.dischargedate,10) as dischargedate"),
        "h.off_name as hname",
        "b.off_name as biopsyhname",
        "s.off_name as consultbiopsyhname",
        "c.off_name as carehname",
        "bi.codename as txbname",
        "dxi.icdname as dxiname",
        "dxb.icdname as dxbname"
      )
      .leftJoin("hospital36 as h", "q.hcode", "h.off_id")
      .leftJoin("hospital36 as b", "q.biopsyhcode", "b.off_id")
      .leftJoin("hospital36 as s", "q.consultbiopsyhcode", "s.off_id")
      .leftJoin("hospital36 as c", "q.carehcode", "c.off_id")
      .leftJoin("biopsycode as bi", "q.tx_biopsy", "bi.code")
      .leftJoin("icd10cancer as dxi", "q.dx_ini", "dxi.icdcode")
      .leftJoin("icd10cancer as dxb", "q.dx_biopsy", "dxb.icdcode")
      .where("q.cid", "=", cid) // Add the where clause here
      .orderBy("q.row_id", "desc");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/pten/id", async (req: Request, res: Response) => {
  const db = req.db15;
  const id = req.query.id; // Assuming 'hcode' is passed as a query parameter
  const cid = decodeId(id);
  console.log("cid=", cid);

  try {
    const rows = await db("tblcancer as q")
      .select(
        "q.*",
        "h.off_name as hname",
        "b.off_name as biopsyhname",
        "s.off_name as consultbiopsyhname",
        "c.off_name as carehname",
        "bi.codename as biopsyname",
        "dxi.icdname as dxiname",
        "dxb.icdname as dxbname"
      )
      .leftJoin("hospital36 as h", "q.hcode", "h.off_id")
      .leftJoin("hospital36 as b", "q.biopsyhcode", "b.off_id")
      .leftJoin("hospital36 as s", "q.consultbiopsyhcode", "s.off_id")
      .leftJoin("hospital36 as c", "q.carehcode", "c.off_id")
      .leftJoin("biopsycode as bi", "q.tx_biopsy", "bi.code")
      .leftJoin("icd10cancer as dxi", "q.dx_ini", "dxi.icdcode")
      .leftJoin("icd10cancer as dxb", "q.dx_biopsy", "dxb.icdcode")
      .where("q.cid", "=", cid) // Add the where clause here
      .orderBy("q.row_id", "desc");
    console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
router.get("/ptsall", async (req: Request, res: Response) => {
  const db = req.db15;
  const hcode = req.query.hcode; // Assuming 'hcode' is passed as a query parameter

  try {
    const rows = await db("tblcancer as q")
      .select(
        "q.*",
        "h.off_name as hname",
        "b.off_name as biopsyhname",
        "c.off_name as carehname",
        "bi.codename as biopsyname",
        "dxi.icdname as dxiname",
        "dxb.icdname as dxbname"
      )
      .leftJoin("hospital36 as h", "q.hcode", "h.off_id")
      .leftJoin("hospital36 as b", "q.biopsyhcode", "b.off_id")
      .leftJoin("hospital36 as c", "q.carehcode", "c.off_id")
      .leftJoin("biopsycode as bi", "q.tx_biopsy", "bi.code")
      .leftJoin("icd10cancer as dxi", "q.dx_ini", "dxi.icdcode")
      .leftJoin("icd10cancer as dxb", "q.dx_biopsy", "dxb.icdcode")
      .orderBy("q.row_id", "desc");
    //console.log("rows=", rows);
    res.send({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "i have Error connecting to the database.",
    });
  }
});
async function isFieldAutoIncrement(db, tableName, fieldName) {
  const result = await db.raw(
    `
    SELECT EXTRA
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = ? AND COLUMN_NAME = ? AND TABLE_SCHEMA = DATABASE()
  `,
    [tableName, fieldName]
  );

  return (
    result[0].length > 0 &&
    result[0][0].EXTRA.toLowerCase().includes("auto_increment")
  );
}

// Function to check if a field exists in the table schema
async function isFieldInTable(db, tableName, fieldName) {
  const columnInfo = await db(tableName).columnInfo();
  // console.log(`Column info for table ${tableName}:`, columnInfo);
  return columnInfo.hasOwnProperty(fieldName);
}

// Function to filter valid fields only
async function filterValidFields(db, tableName, data) {
  const columnInfo = await db(tableName).columnInfo();
  // console.log(`Filtering fields for table ${tableName}:`, columnInfo);
  return Object.keys(data).reduce((validData, key) => {
    if (columnInfo.hasOwnProperty(key)) {
      validData[key] = data[key];
    }
    return validData;
  }, {});
}

router.post("/add", async (req: Request, res: Response) => {
  const db = req.db15;
  const { tableName, idFieldName, data } = req.body;
  const isValidField = await isFieldInTable(db, tableName, idFieldName);
  // console.log(`isFieldInTable result for ${idFieldName}:`, isValidField);
  const isAutoIncrement = isValidField
    ? await isFieldAutoIncrement(db, tableName, idFieldName)
    : false;
  // console.log(`isAutoIncrement result for ${idFieldName}:`, isAutoIncrement);
  try {
    if (isValidField) {
      // Remove idFieldName and any auto-increment fields from data
      const filteredData = await filterValidFields(db, tableName, data);
      console.log(`my filteredData for ${idFieldName}:`, filteredData);

      if (isAutoIncrement) {
        delete filteredData[idFieldName];
      }

      const [id] = await db(tableName).insert(filteredData);
      res.send({ ok: true, id });
    } else {
      res.send({ ok: false, message: "Invalid field name" });
    }
  } catch (error) {
    // console.error("error = ", error);
    res.send({
      ok: false,
      message: "Error updating record in the database.",
    });
  }
});

router.put("/update", async (req: Request, res: Response) => {
  // console.log("Update entrance");
  const db = req.db15;
  const { tableName, idFieldName, id, data } = req.body;

  try {
    // Check if idFieldName exists and is auto-increment in the table schema
    const isValidField = await isFieldInTable(db, tableName, idFieldName);
    // console.log(`isFieldInTable result for ${idFieldName}:`, isValidField);
    const isAutoIncrement = isValidField
      ? await isFieldAutoIncrement(db, tableName, idFieldName)
      : false;
    // console.log(`isAutoIncrement result for ${idFieldName}:`, isAutoIncrement);

    if (isValidField) {
      // Remove idFieldName and any auto-increment fields from data
      const filteredData = await filterValidFields(db, tableName, data);
      if (isAutoIncrement) {
        delete filteredData[idFieldName];
      }

      const query = db(tableName).where(idFieldName, id).update(filteredData);
      //  console.log("Generated SQL Query:", query.toString()); // Log the SQL query
      await query;
      res.send({ ok: true });
    } else {
      res.send({ ok: false, message: "Invalid field name" });
    }
  } catch (error) {
    // console.error("error = ", error);
    res.send({
      ok: false,
      message: "Error updating record in the database.",
    });
  }
});
router.put("/update3", async (req: Request, res: Response) => {
  const db = req.db15;
  const { tableName, idFieldName, id, data } = req.body;

  try {
    await db(tableName).where(idFieldName, id).update(data);
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "Error updating record in the database.",
    });
  }
});
router.put("/update2", async (req: Request, res: Response) => {
  const db = req.db15;
  const { tableName, conditions, data } = req.body;

  try {
    let query = db(tableName).update(data);

    conditions.forEach((condition) => {
      query = query.whereRaw(`${condition.field} ${condition.operator} ?`, [
        condition.value,
      ]);
    });

    await query;
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "Error updating record in the database.",
    });
  }
});
router.delete("/delete", async (req: Request, res: Response) => {
  const db = req.db15;
  const { tableName, idFieldName, id } = req.body;
  console.log(tableName, idFieldName, id);

  try {
    await db(tableName).where(idFieldName, id).del();
    res.send({ ok: true });
  } catch (error) {
    console.error("error = ", error);
    res.send({
      ok: false,
      message: "Error deleting record from the database.",
    });
  }
});
router.post("/deleteCondition", async (req: Request, res: Response) => {
  const db = req.db15;
  const { tableName, conditions } = req.body;

  try {
    let query = db(tableName).del();

    conditions.forEach((condition) => {
      query = query.whereRaw(`${condition.field} ${condition.operator} ?`, [
        condition.value,
      ]);
    });

    await query;
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    res.send({
      ok: false,
      message: "Error deleting record from the database.",
    });
  }
});

export default router;
