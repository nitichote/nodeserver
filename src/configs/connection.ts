import Knex = require('knex');
import { MySqlConnectionConfig } from 'knex';

export class ConnectionModel {
  db(dbname: string) {
    const connection: MySqlConnectionConfig = {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: dbname,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };
    return Knex({
      client: 'mysql',
      connection: connection,
      pool: {
        min: 0,
        max: 100,
        afterCreate: (conn, done) => {
          conn.query('SET NAMES utf8', (err) => {
            done(err, conn);
          });
        },
      },
    });
  }
}
