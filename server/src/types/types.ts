export interface IApiResponse<T = any>{
    statuscode:number,
    data:T,
    message:string
}

export interface DecodedToken {
    id:string
}

export type OutgoingMessage = any