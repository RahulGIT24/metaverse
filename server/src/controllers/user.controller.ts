import { ApiResponse } from "../lib/ApiResponse";
import { asyncHandler } from "../lib/asyncHandler";

export const getUser = asyncHandler(async(req,res)=>{
    try {
        const user = req.user;
        return res.status(200).json(new ApiResponse(200,user,"User Details Fetches"))
    } catch (error) {
        console.log(error)
        if(error instanceof ApiResponse){
            return res.status(error.statuscode).json(error)
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
})