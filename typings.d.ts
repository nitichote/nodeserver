import * as Knex from "knex";
import { Bcrypt } from "./src/configs/bcrypt";

declare module "express" {
  interface Request {
    db1: any; // Actually should be something like `multer.Body`
    db2: any; // Actually should be something like `multer.Body`
    db3: any; // Actually should be something like `multer.Body`
    db4: any; // Actually should be something like `multer.Body`
    db5: any; // Actually should be something like `multer.Body`
    db6: any;
    db7: any;
    db8: any;
    db9: any;
    db10: any;
    db11: any;
    db12: any;
    db13: any;
    db14: any;
    db15: any;
    db16: any;
    knex: Knex;
    decoded: any; // Actually should be something like `multer.Files`
    bcrypt: Bcrypt;
    uploadedFiles?: MulterFile[];
  }
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
