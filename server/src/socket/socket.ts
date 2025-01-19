import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocket("ws://localhost:8080/socket");
wss.on("error", console.error);
export default wss.on("connection", function message(ws) {
  return ws;
});
