"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Login {
    login(db, username, password) {
        return db("users")
            .where("username", username)
            .where("userpass", password)
            .limit(1);
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map