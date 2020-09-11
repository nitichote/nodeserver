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
const login_1 = require("../models/login");
const jwt_1 = require("../models/jwt");
const loginModel = new login_1.Login();
const jwt = new jwt_1.Jwt();
const router = express_1.Router();
router.post('/customer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.body.username;
    let password = req.body.password;
    let db = req.db1;
    try {
        let rs = yield loginModel.login(db, username, password);
        if (rs.length) {
            let payload = {
                id: rs[0].userid,
                username: rs[0].username,
            };
            let token = jwt.sign(payload);
            res.send({ ok: true, token: token, code: HttpStatus.OK });
        }
        else {
            res.send({
                ok: false,
                error: 'Login failed!',
                code: HttpStatus.UNAUTHORIZED,
            });
        }
    }
    catch (error) {
        res.send({
            ok: false,
            error: error.message,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=login.js.map