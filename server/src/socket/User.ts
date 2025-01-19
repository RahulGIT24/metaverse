import { WebSocket } from "ws";
import getRandomID from "../lib/randomIdGenerator";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
import prisma from "../lib/prisma";
import { RoomManager } from "./Room";
import { OutgoingMessage } from "../types/types";

export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;
    private ws: WebSocket

    constructor(ws: WebSocket) {
        this.id = getRandomID(10);
        this.x = 0
        this.y = 0
        this.ws = ws
        this.initHandlers()
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            const parsedData = JSON.parse(data.toString())
            switch (parsedData.type) {
                case "join":
                    const spaceId = parsedData.payload.spaceId;
                    const token = parsedData.payload.token;
                    const userId = (jwt.verify(token, JWT_PASSWORD as string) as JwtPayload).id;
                    // unauthorized
                    if (!userId) {
                        this.ws.close()
                        return;
                    }

                    this.userId = userId;
                    const space = await prisma.space.findFirst({
                        where: {
                            id: spaceId
                        }
                    })
                    if (!space) {
                        this.ws.close();
                        return;
                    }
                    this.spaceId = spaceId;
                    RoomManager.getInstance().userjoin(this, spaceId)
                    this.x = Math.floor(Math.random() * space.width)
                    this.y = Math.floor(Math.random() * space.height)
                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id).map((u) => ({ id: u.id })) ?? []
                        }
                    })
                    RoomManager.getInstance().broadcast({
                        type:"user-joined",
                        payload:{
                            userId:this.userId,
                            x:this.x,
                            y:this.y
                        }
                    },this.spaceId as string,this)
                    break;
                case "move":
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x-moveX)
                    const yDisplacement = Math.abs(this.y-moveY)
                    if((xDisplacement==1 && yDisplacement==0) || (xDisplacement==0 && yDisplacement==1)){
                        this.x = moveX,
                        this.y = moveY
                        RoomManager.getInstance().broadcast({
                            type:"movement",
                            payload:{
                                x:this.x,
                                y:this.y
                            }
                        },this.spaceId as string,this)
                        return;
                    }
                    this.send({
                        type:"movement-rejected",
                        payload:{
                            x:this.x,
                            y:this.y
                        }
                    })
                    break;
            }
        })
    }

    destroy(){
        RoomManager.getInstance().broadcast({
            type:"user-left",
            payload:{
                userId:this.userId
            }
        },this.spaceId as string,this)
        RoomManager.getInstance().userLeave(this,this.spaceId as string)
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }
}