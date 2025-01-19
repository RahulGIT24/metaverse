import WebSocket, { WebSocketServer } from "ws";
import {
  joinSchema,
  movementSchema,
  spaceJoinSchema,
  userJoinEventSchema,
  userLeaveSchema,
} from "../validators/zod";
import { validate } from "../validators/bodyValidator";

const wss = new WebSocket("ws://localhost:8080/socket");

wss.on("error", console.error);

wss.on("connection", function message(ws) {

});
