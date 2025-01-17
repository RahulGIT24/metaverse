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
exports.getBulkMetaData = exports.getAvatars = exports.setMetaData = exports.getUser = void 0;
const ApiResponse_1 = require("../lib/ApiResponse");
const asyncHandler_1 = require("../lib/asyncHandler");
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.getUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, user, "User Details Fetches"));
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res
            .status(500)
            .json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
//set meta data for the user
exports.setMetaData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.update({
            where: {
                email: req.user.email,
            },
            data: {
                avatarId: req.body.avatarId,
            },
        });
        if (!user) {
            throw new ApiResponse_1.ApiResponse(401, null, "Meta data not updated");
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, null, "Meta data updated"));
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res
            .status(500)
            .json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
//get avatars
exports.getAvatars = (0, asyncHandler_1.asyncHandler)((rep, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    try {
        const avatars = yield prisma_1.default.avatar.findMany();
        if (!avatars) {
            throw new ApiResponse_1.ApiResponse(401, null, "No avatars found");
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, avatars, "Avatars found"));
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res
            .status(500)
            .json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
//bulk meta data
exports.getBulkMetaData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hehehehe", req.query.ids);
        const ids = req.query.ids.slice(1, -1).split(",");
        console.log(ids);
        if (ids.length === 0) {
            throw new ApiResponse_1.ApiResponse(401, null, "No avatars to show \n PLease send valid user data");
        }
        const avatars = yield prisma_1.default.user.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
                avatar: {
                    select: {
                        imageUrl: true,
                    },
                },
            },
        });
        if (!avatars) {
            throw new ApiResponse_1.ApiResponse(404, null, "No avatars found");
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, avatars, "Avatar bulk metaData"));
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res
            .status(500)
            .json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
