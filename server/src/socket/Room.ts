import { map } from "zod";
import { OutgoingMessage } from "../types/types";
import ws from "./socket";
import { User } from "./User";

export class RoomManager {

  rooms = new Map<string, User[]>();
  static instance: RoomManager;

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  private constructor() {
    this.rooms = new Map();
  }
  public userjoin(user:User, spaceId:string) {
    if (!this.rooms.has(spaceId)) {
        this.rooms.set(spaceId, [user])
        return;
      }
    this.rooms.set(spaceId,([...this.rooms.get(spaceId)??[],user]));
  }

  public userLeave(user: User, spaceId: string) {
    //data = JSON.parse(data)
    if (!this.rooms.has(spaceId)) {
      return;
    }

    this.rooms.set(
      spaceId,
      this.rooms.get(spaceId)?.filter((u) => u.id != user.id) ?? []
    );
    //this.rooms.delete(spaceId);
  }

  public broadcast(message: OutgoingMessage, roomId:string, user:User) {
  if(!this.rooms.has(roomId)){
    return ; 
  }
  
  this.rooms.get(roomId)?.forEach(u => {
        if(u.id!==user.id){ 
            u.send(message)
        }
  });
  
  }
}
