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
exports.verifyAdmin = exports.verifyJWT = void 0;
const asyncHandler_1 = require("../lib/asyncHandler");
const ApiResponse_1 = require("../lib/ApiResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.accesstoken || ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
        if (!token) {
            throw new ApiResponse_1.ApiResponse(403, null, "Unauthorized");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: decodedToken.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        if (!user) {
            throw new ApiResponse_1.ApiResponse(403, null, "Unauthorized");
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
exports.verifyAdmin = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role.toLowerCase() !== "admin") {
            throw new ApiResponse_1.ApiResponse(401, null, "Unauthorized");
        }
        next();
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
