import { log } from 'console';
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
        console.log('tablename=',tableName);
console.log('datacus=',dataCustom);
        return dataCustom;
    }
    async  insertFormData(db: Knex,tableName: string, formData: any): Promise<any> {
        // First, fetch column names from the table to filter formData
        
        const tableColumns = await db(tableName).columnInfo();
        const columnNames = Object.keys(tableColumns);
    console.log('columnForm=',tableColumns);
    console.log('columnNames=',columnNames);
        // Filter formData to only include keys that exist as column names in the table
        const filteredData = Object.keys(formData)
            .filter(key => columnNames.includes(key))
            .reduce((obj, key) => {
                obj[key] = formData[key];
                return obj;
            }, {});
    
        // Insert the filtered data into the database
        try {
            const result = await db(tableName).insert(filteredData);
            console.log('result new=',result);
            return { success: true, id: result[0] };  // Assuming auto-increment ID is returned
        } catch (error) {
            console.error('Insert failed:', error);
            return { success: false, error: error.message };
        }
    }

    async insertData(db: Knex, tableName: string, formData: any) {
        console.log("Received formData:", formData);  // Log the complete formData
        let rs: any;
        let number = _.size(formData) - 1;
        for (let i = 0; i <= number; i++) {
            console.log(`formData[${i}] before transformation:`, formData[i]);  // Before transformation
            let newData = await this.dataColumn(db, tableName, formData[i]);
            console.log(`newData after transformation:`, newData);  // After transformation
    
            [rs] = await db(tableName).insert(newData);
          

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
            console.log(`formData[${i}] before transformation:`, whereName[i],tableName); 
            await db(tableName).del().where(whereName[i]);
        }
        return number + 1;
    }

}