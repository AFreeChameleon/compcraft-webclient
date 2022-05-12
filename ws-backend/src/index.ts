import WebS from 'ws';
import express, { Express } from 'express';
import http, { Server } from 'http';
import cors from 'cors';
import { parse } from 'url';
import fileUpload from 'express-fileupload';

import { routeAction } from './ws/lib/actions';
import { addRoom } from './ws/lib/room';
import apiRouter from './backend/router';

const app: Express = express();
const server: Server = http.createServer(app);

const wss: any = new WebS.Server({ noServer: true })

wss.on('connection', (socket: any) => {
    socket.on('message', (msg: string) => {
        const req = JSON.parse(msg);
        if (!req.action) {
            return;
        }
        routeAction(req, socket);
    })
});

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url);
  
    if (pathname === '/ws-server') {
        wss.handleUpgrade(request, socket, head, function done(ws: any) {
            wss.emit('connection', ws, request);
        });
    } else {
      socket.destroy();
    }
});

app.use(cors({
    origin: 'http://localhost:9000',
    credentials: true,
    exposedHeaders: ['set-cookie']
}));
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.json());
app.use('/api', apiRouter);

server.listen(9000, () => console.log('Websocket & backend server listening on port 9000'))