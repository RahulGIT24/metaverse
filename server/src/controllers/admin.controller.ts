import { ApiResponse } from "../lib/ApiResponse";
import { asyncHandler } from "../lib/asyncHandler";
import prisma from "../lib/prisma";
import { validate } from "../validators/bodyValidator";
import { avatarSchema, elementSchema, mapSchema, updateElementSchema } from "../validators/zod";

export const createElement = asyncHandler(async (req, res) => {
    try {
        validate(elementSchema, req.body);
        const element = await prisma.element.create({
            data: req.body
        })
        if (!element) {
            throw new ApiResponse(400, null, "Element Not Created")
        }
        return res.status(200).json(new ApiResponse(200, element, "Element Created"))
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"))
    }
})

export const updateElement = asyncHandler(async (req, res) => {
    try {
        validate(updateElementSchema, req.body);
        const { id } = req.query;
        const updatedElement = await prisma.element.update({
            where: {
                id: id
            }, data: {
                imageUrl: req.body.imageUrl
            }
        })
        if (!updateElement) {
            throw new ApiResponse(400, null, "Can't update element")
        }
        return res.status(200).json(new ApiResponse(200, updateElement, "Element Updated"))
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"))
    }
})

export const createAvatar = asyncHandler(async (req, res) => {
    try {
        validate(avatarSchema, req.body)
        const avatar = await prisma.avatar.create({
            data: req.body
        })
        if (!avatar) {
            throw new ApiResponse(400, null, "Unable to create avatar")
        }
        return res.status(201).json(new ApiResponse(201, avatar, "Avatar Created"))
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"))
    }
})

export const createMap = asyncHandler(async (req, res) => {
    try {
        validate(mapSchema, req.body);
        const map = await prisma.map.create({
            data: {
                name: req.body.name,
                width: parseInt(req.body.dimensions.split("x")[0]),
                height: parseInt(req.body.dimensions.split("x")[1]),
                thumbnail: req.body.thumbnail,
                mapElements: {
                    create: req.body.defaultElements.map((e:any) => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            }
        })
        if (!map) {
            throw new ApiResponse(400, null, "Map Not Created")
        }
        return res.status(200).json(new ApiResponse(200, map, "Map Created"))
    } catch (error) {
        console.log(error)
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"))
    }
})