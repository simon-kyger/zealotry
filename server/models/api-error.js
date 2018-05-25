export default class ApiError {
    constructor(status, message, code) {
        this.status = status;
        this.message = message;
        this.code = code;
    }
}