import crypto from 'crypto';

const roomList: any = {

}

const createRoomUUID = () => {
    let uuid = crypto.randomBytes(4).toString('hex');
    while (Object.keys(roomList).includes(uuid)) {
        uuid = crypto.randomBytes(4).toString('hex')
    }
    return uuid;
}

export const addRoom = (data: any) => {
    const roomCode = createRoomUUID();
    roomList[roomCode] = {
        data: {
            ...data
        },
        connections: []
    }
    return roomCode;
}

export const addConnection = (roomCode: string, type: string, socket: any) => {
    roomList[roomCode].connections.push({
        type: type,
        socket: socket
    });
    return roomList[roomCode].connections;
}

export const getRoomList = () => {
    return roomList;
}