"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSchema = exports.avatarSchema = exports.updateElementSchema = exports.elementSchema = exports.signinSchema = exports.signupSchema = void 0;
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
    password: passwordSchema,
    type: zod_1.default.enum(["admin", "user"])
});
exports.signinSchema = zod_1.default.object({
    identifier: zod_1.default.union([
        emailSchema, usernameSchema
    ]),
    password: passwordSchema
});
exports.elementSchema = zod_1.default.object({
    imageUrl: zod_1.default.string().url(),
    width: zod_1.default.number().min(1, { message: "Min 1 width is required" }),
    height: zod_1.default.number().min(1, { message: "Min 1 height is required" }),
    static: zod_1.default.boolean()
});
exports.updateElementSchema = zod_1.default.object({
    imageUrl: zod_1.default.string().url(),
});
exports.avatarSchema = zod_1.default.object({
    imageUrl: zod_1.default.string().url(),
    name: zod_1.default.string()
});
exports.mapSchema = zod_1.default.object({
    thumbnail: zod_1.default.string(),
    dimensions: zod_1.default.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: zod_1.default.string(),
    defaultElements: zod_1.default.array(zod_1.default.object({
        elementId: zod_1.default.string(),
        x: zod_1.default.number(),
        y: zod_1.default.number(),
    }))
});
