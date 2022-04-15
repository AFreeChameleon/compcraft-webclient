"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var room_1 = require("./lib/room");
var wss = new ws_1.default.Server({ port: 8000 }, function () { return console.log('Websocket server listening on port 8000'); });
wss.on('connection', function (socket) {
    console.log('Connected', socket);
    var roomCode = (0, room_1.addRoom)();
    wss.broadcast(roomCode);
    socket.on("message", function (msg) {
        wss.broadcast(msg);
    });
});
wss.broadcast = function (msg) {
    wss.clients.forEach(function (client) {
        client.send(msg);
    });
};
