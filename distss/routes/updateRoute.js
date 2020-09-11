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
const express_1 = require("express");
const HttpStatus = require("http-status-codes");
const putModel_1 = require("../models/putModel");
const putmodel = new putModel_1.PutModel();
const router = express_1.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let db = req.db1;
    let data = req.body.data;
    let tableName = data.tableName;
    let dataUpdate = data.whereName;
    let dataInsert = data.formData;
    try {
        let rows = yield putmodel.updateData(db, tableName, dataUpdate, dataInsert);
        res.send({ ok: true, rows: rows, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({ ok: false, rows: error, code: HttpStatus.NOT_FOUND });
    }
}));
exports.default = router;
//# sourceMappingURL=updateRoute.js.map