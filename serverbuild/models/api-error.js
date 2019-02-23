"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ApiError {
    constructor(status, message, code) {
        this.status = status;
        this.message = message;
        this.code = code;
    }
}
exports.default = ApiError;