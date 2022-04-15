"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = exports.addRoom = void 0;
var crypto_1 = __importDefault(require("crypto"));
var rooms = [];
var createRoomUUID = function () {
    var uuid = crypto_1.default.randomBytes(4).toString('hex');
    while (rooms.includes(uuid)) {
        uuid = crypto_1.default.randomBytes(4).toString('hex');
    }
    return uuid;
};
var addRoom = function () {
    var roomCode = createRoomUUID();
    rooms.push(roomCode);
    return roomCode;
};
exports.addRoom = addRoom;
var getRooms = function () {
    return rooms;
};
exports.getRooms = getRooms;
