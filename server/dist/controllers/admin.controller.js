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
exports.createMap = exports.createAvatar = exports.updateElement = exports.createElement = void 0;
const ApiResponse_1 = require("../lib/ApiResponse");
const asyncHandler_1 = require("../lib/asyncHandler");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bodyValidator_1 = require("../validators/bodyValidator");
const zod_1 = require("../validators/zod");
exports.createElement = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, bodyValidator_1.validate)(zod_1.elementSchema, req.body);
        const element = yield prisma_1.default.element.create({
            data: req.body
        });
        if (!element) {
            throw new ApiResponse_1.ApiResponse(400, null, "Element Not Created");
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, element, "Element Created"));
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
exports.updateElement = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, bodyValidator_1.validate)(zod_1.updateElementSchema, req.body);
        const { id } = req.query;
        const updatedElement = yield prisma_1.default.element.update({
            where: {
                id: id
            }, data: {
                imageUrl: req.body.imageUrl
            }
        });
        if (!exports.updateElement) {
            throw new ApiResponse_1.ApiResponse(400, null, "Can't update element");
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, exports.updateElement, "Element Updated"));
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
exports.createAvatar = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, bodyValidator_1.validate)(zod_1.avatarSchema, req.body);
        const avatar = yield prisma_1.default.avatar.create({
            data: req.body
        });
        if (!avatar) {
            throw new ApiResponse_1.ApiResponse(400, null, "Unable to create avatar");
        }
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, avatar, "Avatar Created"));
    }
    catch (error) {
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
exports.createMap = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, bodyValidator_1.validate)(zod_1.mapSchema, req.body);
        const map = yield prisma_1.default.map.create({
            data: {
                name: req.body.name,
                width: parseInt(req.body.dimensions.split("x")[0]),
                height: parseInt(req.body.dimensions.split("x")[1]),
                thumbnail: req.body.thumbnail,
                mapElements: {
                    create: req.body.defaultElements.map((e) => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            }
        });
        if (!map) {
            throw new ApiResponse_1.ApiResponse(400, null, "Map Not Created");
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, map, "Map Created"));
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiResponse_1.ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal Server Error"));
    }
}));
