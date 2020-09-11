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
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const express_1 = require("express");
const request_1 = require("../models/request");
const requestModel = new request_1.RequestModel();
const router = express_1.Router();
router.get('/request', (req, res) => {
    res.send({
        ok: true,
        message: 'Welcome to Api Server!',
        code: HttpStatus.OK,
    });
});
router.post('/request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let code = moment().format('x');
    let cause = req.body.cause;
    let customerId = req.decoded.id;
    let requestDate = moment().format('YYYY-MM-DD');
    let requestTime = moment().format('HH:mm:ss');
    let data = {};
    data.request_code = code;
    data.request_cause = cause;
    data.customer_id = customerId;
    data.request_date = requestDate;
    data.request_time = requestTime;
    try {
        yield requestModel.saveRequest(req.db1, data);
        res.send({ ok: true, code: HttpStatus.OK });
    }
    catch (error) {
        res.send({ ok: false, error: error.message, code: HttpStatus.OK });
    }
}));
exports.default = router;
//# sourceMappingURL=request.js.map