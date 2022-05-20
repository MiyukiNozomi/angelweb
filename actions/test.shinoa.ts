import { IncomingMessage, ServerResponse } from "http";

export function OnAction(response : ServerResponse, request : IncomingMessage) {
    response.writeHead(200);
    response.write("Hello!");
    response.end();
}