import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { ApiResponse } from "../lib/ApiResponse";
import jwt from "jsonwebtoken"
import { DecodedToken } from "../types/types";
import prisma from "../lib/prisma";

export const verifyJWT = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiResponse(403,null,"Unauthorized")
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedToken

        const user = await prisma.user.findUnique({
            where:{
                id:decodedToken.id
            },
            select:{
                id:true,
                username:true,
                email:true,
                role:true
            }
        })

        if(!user){
            throw new ApiResponse(403,null,"Unauthorized");
        }

        (req as any).user = user;

        next();
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"));
    }
})

export const verifyAdmin = asyncHandler(async(req,res:Response,next:NextFunction)=>{
    try {
        if(req.user.role.toLowerCase()!=="admin"){
            throw new ApiResponse(401,null,"Unauthorized")
        }
        next();
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"));
    }
})