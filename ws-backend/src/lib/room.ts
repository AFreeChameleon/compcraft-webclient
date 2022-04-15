import crypto from 'crypto';

const rooms: string[] = [];

const createRoomUUID = () => {
    let uuid = crypto.randomBytes(4).toString('hex');
    while (rooms.includes(uuid)) {
        uuid = crypto.randomBytes(4).toString('hex')
    }
    return uuid;
}

export const addRoom = () => {
    const roomCode = createRoomUUID();
    rooms.push(roomCode);
    return roomCode;
}

export const getRooms = () => {
    return rooms;
}