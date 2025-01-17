"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiResponse_1 = require("../lib/ApiResponse");
const validate = (schema, data) => {
    var _a;
    const checkBody = schema.safeParse(data);
    // console.log(checkBody.error)
    if (checkBody.success === false) {
        const error = (_a = checkBody.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message;
        throw new ApiResponse_1.ApiResponse(400, null, error);
    }
};
exports.validate = validate;
