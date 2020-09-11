"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
class ConnectionModel {
    db(dbname) {
        const connection = {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: dbname,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true,
            debug: true,
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
exports.ConnectionModel = ConnectionModel;
//# sourceMappingURL=connection.js.map