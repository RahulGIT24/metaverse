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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signUp = void 0;
const ApiResponse_1 = require("../lib/ApiResponse");
const asyncHandler_1 = require("../lib/asyncHandler");
const generateTokens_1 = require("../lib/generateTokens");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bodyValidator_1 = require("../validators/bodyValidator");
const zod_1 = require("../validators/zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.signUp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, bodyValidator_1.validate)(zod_1.signupSchema, req.body);
        const user = yield prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]
            }
        });
        if (user) {
            throw new ApiResponse_1.ApiResponse(400, null, "User with this email or username already exist");
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const data = Object.assign(Object.assign({}, req.body), { isVerified: true });
        const createdUser = yield prisma_1.default.user.create({
            data
        });
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, createdUser, "User Registered"));
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(new ApiResponse_1.ApiResponse(error.statuscode, error.data, error.message));
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server error"));
    }
}));
exports.signin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        (0, bodyValidator_1.validate)(zod_1.signinSchema, req.body);
        const checkUser = yield prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true
            },
        });
        if (!checkUser) {
            throw new ApiResponse_1.ApiResponse(404, null, "Invalid Credentials");
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };
        const checkPassword = yield bcrypt_1.default.compare(password, checkUser.password);
        if (!checkPassword) {
            return res
                .status(400)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse_1.ApiResponse(401, null, "Invalid Credentials"));
        }
        const accesstoken = (0, generateTokens_1.generateAccessToken)({ id: checkUser.id, username: checkUser.username });
        const refreshtoken = (0, generateTokens_1.generateRefreshToken)({ id: checkUser.id });
        const addrefreshtoken = yield prisma_1.default.user.update({
            where: { id: checkUser.id },
            data: {
                refreshToken: refreshtoken
            }
        });
        if (!addrefreshtoken) {
            return res.status(400).json(new ApiResponse_1.ApiResponse(400, null, "Error while adding token"));
        }
        return res.status(200)
            .cookie("accesstoken", accesstoken, options)
            .cookie("refreshtoken", refreshtoken, options)
            .json(new ApiResponse_1.ApiResponse(200, null, "Logged In"));
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(new ApiResponse_1.ApiResponse(error.statuscode, null, error.message));
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal server error"));
    }
}));
