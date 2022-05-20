"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnAction = void 0;
function OnAction(response, request) {
    response.writeHead(200);
    response.write("Hello!");
    response.end();
}
exports.OnAction = OnAction;
