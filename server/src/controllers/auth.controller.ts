import { CookieOptions } from "express";
import { ApiResponse } from "../lib/ApiResponse";
import { asyncHandler } from "../lib/asyncHandler";
import { generateAccessToken, generateRefreshToken } from "../lib/generateTokens";
import prisma from "../lib/prisma";
import { validate } from "../validators/bodyValidator";
import { signinSchema, signupSchema } from "../validators/zod";
import bcrypt from "bcrypt"

export const signUp =  asyncHandler(async(req,res)=>{
    try {
        validate(signupSchema,req.body)
        const user = await prisma.user.findFirst({
            where:{
                OR:[
                    {email:req.body.email},
                    {username:req.body.username}
                ]
            }
        })
        if(user){
            throw new ApiResponse(400,null,"User with this email or username already exist");
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        req.body.password = hashedPassword;
        const data = {...req.body,isVerified:true}
        const createdUser = await prisma.user.create({    
            data
        })
        return res.status(201).json(new ApiResponse(201,createdUser,"User Registered"))
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(new ApiResponse(error.statuscode,error.data,error.message))
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server error"))
    }
})

export const signin = asyncHandler(async(req,res)=>{
    try {
        const {identifier,password} = req.body;
        validate(signinSchema,req.body)

        const checkUser = await prisma.user.findFirst(
            {
                where:{
                    OR:[
                        {email:identifier},
                        {username:identifier}
                    ]
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    password:true
                },
            }
        )

        if(!checkUser){
            throw new ApiResponse(404,null,"Invalid Credentials")
        }

        const options:CookieOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"none"
        } 

        const checkPassword = await bcrypt.compare(password,checkUser.password);
        if(!checkPassword){
            return res
        .status(400)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(401, null, "Invalid Credentials"));
        }

        const accesstoken =  generateAccessToken({id:checkUser.id,username:checkUser.username});
        const refreshtoken =  generateRefreshToken({id:checkUser.id});

        const addrefreshtoken = await prisma.user.update({
            where:{id:checkUser.id},
            data:{
                refreshToken:refreshtoken
            }
        })

        if(!addrefreshtoken){
            return res.status(400).json(new ApiResponse(400,null,"Error while adding token"))
        }

        return res.status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",refreshtoken,options)
        .json(new ApiResponse(200,null,"Logged In"))
        
    } catch (error) {
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(new ApiResponse(error.statuscode,null,error.message))
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal server error"))
    }
})