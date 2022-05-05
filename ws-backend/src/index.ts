import WebS from 'ws';
import { routeAction } from './lib/actions';

import { addRoom } from './lib/room';

const wss: any = new WebS.Server({port:9000}, () => console.log('Websocket server listening on port 9000'))

wss.on('connection', (socket: any) => {
    socket.on("message", (msg: string) => {
        const req = JSON.parse(msg);
        if (!req.action) {
            return;
        }
        routeAction(req, socket);
    })
});

// wss.broadcast = (msg: string) => {
//     wss.clients.forEach((client: any) => {
//         client.send(msg)
//     });
// };