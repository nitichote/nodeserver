import * as Knex from 'knex';

declare module 'express' {
  interface Request {
    db1: any; // Actually should be something like `multer.Body`
    db2: any; // Actually should be something like `multer.Body`
    db3: any; // Actually should be something like `multer.Body`
    db4: any; // Actually should be something like `multer.Body`
    db5: any; // Actually should be something like `multer.Body`
    db6:any;
    db7:any;
    db8:any;
    knex: Knex;
    decoded: any; // Actually should be something like `multer.Files`
  }
}
