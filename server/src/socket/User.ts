import { WebSocket } from "ws";
import getRandomID from "../lib/randomIdGenerator";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
import prisma from "../lib/prisma";

export class User{
    public id:string;
    public userId?:string;
    private spaceId?:string;
    private x:number;
    private y:number;
    private ws:WebSocket

    constructor(ws:WebSocket){
        this.id = getRandomID(10);
        this.x = 0
        this.y = 0
        this.ws = ws
        this.initHandlers()
    }

    initHandlers(){
        this.ws.on("message",async(data)=>{
            const parsedData = JSON.parse(data.toString())
            switch (parsedData.type) {
                case "join":
                    const spaceId = parsedData.payload.spaceId;
                    const token = parsedData.payload.token;
                    const userId = (jwt.verify(token,JWT_PASSWORD as string) as JwtPayload).id;
                    // unauthorized
                    if(!userId){
                        this.ws.close()
                        return;
                    }

                    this.userId = userId;
                    const space = await prisma.space.findFirst({
                        where:{
                            id:spaceId
                        }
                    })
                    if(!space){
                        this.ws.close();
                        return;
                    }
                    this.spaceId=spaceId;
                    break;
            
                case "move":
                    
                    break;
            }
        })
    }
}