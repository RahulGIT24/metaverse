"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const emailSchema = zod_1.default.string().email({ message: "Invalid Email Address" });
const usernameSchema = zod_1.default.string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]{0,28}[a-zA-Z0-9])?$/, {
    message: "Invalid Username format",
});
const passwordSchema = zod_1.default.string().min(8, { message: "Min Password length is 8" }).max(20, { message: "Max Password Length is 20" });
exports.signupSchema = zod_1.default.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema
});
exports.signinSchema = zod_1.default.object({
    identifier: zod_1.default.union([
        emailSchema, usernameSchema
    ]),
    password: passwordSchema
});
