import WebS from 'ws';

import { addRoom } from './lib/room';

const wss: any = new WebS.Server({port:8000}, () => console.log('Websocket server listening on port 8000'))

wss.on('connection', (socket: any) => {
    console.log('Connected', socket)
    const roomCode = addRoom();
    wss.broadcast(roomCode);
    socket.on("message", (msg: string) => {
        wss.broadcast(msg);
    })
});

wss.broadcast = (msg: string) => {
    wss.clients.forEach((client: any) => {
        client.send(msg)
    });
};