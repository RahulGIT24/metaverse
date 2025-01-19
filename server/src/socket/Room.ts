import { map } from "zod";
import { Room } from "../types/types";
import ws from "./socket";
import { User } from "./User";

class RoomManager {
  //user add
  //user remove
  //broadcast events
  static instance: RoomManager;

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }
  //make a room type
  private rooms = new Map<string, User[]>();
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

  public boradcast(message: any, roomId:string, user:User) {
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
