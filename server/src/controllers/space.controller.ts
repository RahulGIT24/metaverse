import { ApiResponse } from "../lib/ApiResponse";
import { asyncHandler } from "../lib/asyncHandler";
import prisma from "../lib/prisma";
import { validate } from "../validators/bodyValidator";
import { spaceSchema } from "../validators/zod";

export const createSpace = asyncHandler(async(req,res)=>{
    try {
        validate(spaceSchema,req.body);
        const {dimensions,name} = req.body;
        const space = await prisma.space.create({
            data:{
                width:parseInt(dimensions.split("x")[0]),
                height:parseInt(dimensions.split("x")[1]),
                name:name,
                creatorId:req.user.id
            }
        })
        return res.status(201).json(new ApiResponse(200,{spaceId:space.id},"Space Created"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})

export const deleteSpace = asyncHandler(async(req,res)=>{
    try {
        const {spaceId} = req.params;
        const deletedSpace = await prisma.space.delete({
            where:{
                id:spaceId,
                creatorId:req.user.id
            }
        })
        if(!deletedSpace){
            throw new ApiResponse(403,null,"You can't delete this space")
        }
        return res.status(200).json(new ApiResponse(200,null,"Space Deleted"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})

export const getMySpaces = asyncHandler(async(req,res)=>{
    try {
        const spaces =  await prisma.space.findMany({
            where:{
                creatorId:req.user.id
            }
        })
        return res.status(200).json(new ApiResponse(200,spaces ?? [],"Space Deleted"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})

export const getSpace = asyncHandler(async(req,res)=>{
    try {
        const {spaceId} = req.params;
        const space =  await prisma.space.findUnique({
            where:{
                id:spaceId,
                creatorId:req.user.id
            }
        })
        if(!space){
            throw new ApiResponse(400,null,"No Space Exist");
        }
        return res.status(200).json(new ApiResponse(200,space ?? [],"Space Deleted"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})

export const getAllSpaces = asyncHandler(async(req,res)=>{
    try {
        const spaces = await prisma.space.findMany({})
        return res.status(200).json(new ApiResponse(200,spaces ?? [],"Space Deleted"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})