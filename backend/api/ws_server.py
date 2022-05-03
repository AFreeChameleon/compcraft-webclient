import asyncio
import time
import json
import string
import random
import websockets

class WebsocketServer:
    rooms = {}

    def __init__(self):
        print('Loading websocket server on port ws://localhost:8000')
        self.server = websockets.serve(self.handler, 'localhost', 8000)

    def create_room_uuid():
        while True:
            uuid = ''.join(random.choice(
                string.ascii_uppercase + 
                string.digits + 
                string.ascii_lowercase
            ) for i in range(6))
            if not rooms[uuid]:
                return uuid

    def add_connection(self, room_code, type):
        self.rooms[room_code].connections.append({
            type: type,
            socket: self.websocket
        })
        return self.rooms[room_code].connections

    async def add_heartbeat(self, room_code):
        while True:
            server = self.get_server(room_code)
            if not server:
                break
            else:
                await server_socket.send(json.dumps({
                    action: 'get-time',
                    roomCode: room_code
                }))
                time.sleep(20)

    def get_server(self, room_code):
        conn_list = [conn for conn in self.rooms[room_code].connections if conn.get('type') == 'server']
        if len(conn_list) > 0:
            return conn_list[0]
        else:
            return None

    def get_client(self, room_code):
        conn_list = [conn for conn in self.rooms[room_code].connections if conn.get('type') == 'client']
        if len(conn_list) > 0:
            return conn_list[0]
        else:
            return None

    async def handler(self, websocket, path):
        self.websocket = websocket
        raw_data = await websocket.recv()
        data = json.loads(raw_data)
        reply = json.dumps(self.route_action(data))
        await self.websocket.send(reply);


    def route_action(self, req):
        if req.action == 'create-room':
            res = self.create_room(req)
            return res
        elif req.action == 'join-room':
            res = self.join_room(req)
            return res
        elif req.action == 'get-files-data':
            res = self.get_files_data(req)
        else:
            return {
                action: req.action,
                status: 'failed'
            }

    def create_room(self, req):
        room_code = self.create_room_uuid()
        new_room = {
            data: {
                *req.data
            },
            connections: []
        }
        self.rooms[room_code] = new_room
        self.add_connection(room_code, 'server')
        return {
            status: 'success',
            action: 'create-room',
            data: {
                room_code: room_code
            }
        }
    
    def join_room(self, req):
        room_code = req.room_code
        self.add_connection(room_code, 'client')
        return {
            status: 'success',
            action: 'join-room',
            data: {
                room_code: room_code
            }
        }

    async def get_files_data(self, req):
        room_code = req.room_code
        server_socket = self.get_server(room_code).socket
        msg = {
            action: 'get-files-data',
            roomCode: room_code,
            data: {
                id: req.data.id,
                currentPath: req.data.currentPath
            }
        }
        await server_socket.send(json.dumps(msg))
        return {
            status: 'sending',
            action: 'get-files-data'
        }
    
    async def set_files_data(self, req):
        room_code = req.room_code
        socket = None
        res = {
            action: 'set-files-data'
        }
        if req.type == 'server':
            socket = self.get_server(room_code).socket
            res.status = 'sending'
        else:
            socket = self.get_client(room_code).socket
            res.status = 'success'
        msg = {
            status: 'success',
            action: 'set-files-data',
            roomCode: room_code,
            data: {
                *req.data
            }
        }
        await socket.send(json.dumps(msg))
        return res