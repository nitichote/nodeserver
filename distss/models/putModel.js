"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class PutModel {
    dataColumn(db, tableName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataCustom = {};
            let column = yield db(tableName).columnInfo();
            for (let key in data) {
                if (column[key])
                    dataCustom[key] = data[key];
            }
            return dataCustom;
        });
    }
    insertData(db, tableName, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs;
            let number = _.size(formData) - 1;
            for (let i = 0; i <= number; i++) {
                let newData = yield this.dataColumn(db, tableName, formData[i]);
                rs = yield db(tableName).insert(newData);
            }
            let res = { "rs": rs, "number": number + 1 };
            return res;
        });
    }
    updateData(db, tableName, whereName, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs;
            let number = _.size(formData) - 1;
            for (let i = 0; i <= number; i++) {
                let newData = yield this.dataColumn(db, tableName, formData[i]);
                rs = yield db(tableName).update(newData).where(whereName[i]);
            }
            let res = { "rs": rs, "number": number + 1 };
            return res;
        });
    }
    deleteData(db, tableName, whereName) {
        return __awaiter(this, void 0, void 0, function* () {
            let number = _.size(whereName) - 1;
            for (let i = 0; i <= number; i++) {
                yield db(tableName).del().where(whereName[i]);
            }
            return number + 1;
        });
    }
}
exports.PutModel = PutModel;
//# sourceMappingURL=putModel.js.map