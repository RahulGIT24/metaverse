import { ZodSchema } from "zod";
import { ApiResponse } from "../lib/ApiResponse";

export const validate = (schema:ZodSchema,data:any)=>{
    const checkBody = schema.safeParse(data)
    if(checkBody.success===false){
        const error = checkBody.error.issues[0]?.message;
        throw new ApiResponse(400,null,error);
    }
}