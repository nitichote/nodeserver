import Knex = require('knex');
import * as _ from 'lodash';

export class PutModel {

    async  dataColumn(db: Knex, tableName: string, data: any) {
        let dataCustom = {};

        let column = await db(tableName).columnInfo();

        for (let key in data) {
            if (column[key])
                dataCustom[key] = data[key];
        }

        return dataCustom;
    }


    async insertData(db: Knex, tableName: string, formData: any) {
        let rs: any;
        let number = _.size(formData) - 1;
        for (let i = 0; i <= number; i++) {
            let newData = await this.dataColumn(db, tableName, formData[i]);
            rs = await db(tableName).insert(newData);
        }
        let res = { "rs": rs, "number": number + 1 }
        return res;
    }

    async  updateData(db: Knex, tableName: string, whereName: any, formData: any) {
        let rs: any;
        let number = _.size(formData) - 1;
        for (let i = 0; i <= number; i++) {
            let newData = await this.dataColumn(db, tableName, formData[i]);
            rs = await db(tableName).update(newData).where(whereName[i]);
        }
        let res = { "rs": rs, "number": number + 1 }
        return res;
    }

    async deleteData(db: Knex, tableName: string, whereName: any) {
        let number = _.size(whereName) - 1;
        for (let i = 0; i <= number; i++) {
            await db(tableName).del().where(whereName[i]);
        }
        return number + 1;
    }

}