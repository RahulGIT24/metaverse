export interface IApiResponse<T = any>{
    statuscode:number,
    data:T,
    message:string
}

export interface DecodedToken {
    id:string
}

export interface 
export interface Room{ 
    id:string,
    members:Array<string>
}