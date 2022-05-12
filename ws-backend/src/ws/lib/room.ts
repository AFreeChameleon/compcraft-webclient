import crypto from 'crypto';

const roomList: any = {

}

export const addHeartbeat = (roomCode: string, serverSocket: any) => {
    try {
        setInterval(() => {
            serverSocket.send(JSON.stringify({
                action: 'get-time',
                roomCode: roomCode
            }))
        }, 10000);
    } catch (err) {

    }
}

export const addClientHeartbeat = (roomCode: string, clientSocket: any) => {
    try {
        setInterval(() => {
            clientSocket.send(JSON.stringify({
                action: 'ping',
                roomCode: roomCode
            }))
        }, 5000)
    } catch (err) {

    }
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

export const getRoomData = (roomCode: string) => {
    return roomList[roomCode].data;
}

export const getRoomList = () => {
    return roomList;
}

export const getServerSocket = (roomCode: string) => {
    const serverSocket = roomList[roomCode].connections.find((c: any) => c.type === 'server');
    return serverSocket;
}

export const getClientSockets = (roomCode: string) => {
    const clientSockets = roomList[roomCode].connections.filter((c: any) => c.type === 'client');
    return clientSockets;
}

const getSockets = () => {
    const roomCodes = Object.keys(roomList);
    let connections: any[] = [];
    console.log(roomCodes);
    for (const code of roomCodes) {
        console.log(code);
        connections = [
            ...connections,
            ...roomList[code].connections.map((c: any) => ({roomCode: code, socket: c}))
        ]
    }
    return connections;
}

const removeSocket = (socket: any, roomCode: string) => {
    roomList[roomCode].connections = 
        roomList[roomCode].connections.filter((c: any) => c.id !== socket.id);
}

const sendPing = (socket: any) => {
    socket.send(JSON.stringify({
        action: 'ping'
    }));
}

// Heartbeat check
setInterval(() => {
    const sockets = getSockets();
    sockets.forEach(({socket, roomCode}) => {
        console.log(socket.socket.is_alive, socket.type)
        if (roomList[roomCode]) {
            if (!socket.socket.is_alive) {
                socket.socket.terminate();
                removeSocket(socket.socket, roomCode);
            }
            if (roomList[roomCode].connections.length === 0) {
                delete roomList[roomCode];
            }
            socket.socket.is_alive = false;
            sendPing(socket.socket);
        }
    });
}, 10000);