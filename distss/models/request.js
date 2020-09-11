"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestModel {
    saveRequest(db, data) {
        return db('requests')
            .insert(data);
    }
}
exports.RequestModel = RequestModel;
//# sourceMappingURL=request.js.map