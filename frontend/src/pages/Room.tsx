import React, {useEffect, useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RoomMain from '../components/RoomMain';
import MinecraftWebSocket from '../lib/MinecraftWebSocket';

type RouteParams = {
    roomCode: string;
}

function RoomCodeIndex() {
    let [ws, setWs] = useState(null);
    const params = useParams<RouteParams>();
    useEffect(() => {
        console.log(process.env)
        const connection = new WebSocket(process.env.REACT_APP_WS_HOST);
        const websocket = new MinecraftWebSocket(connection, params.roomCode);
        setWs(websocket);
    }, []);
    return ws ? (
        <div>
            <RoomMain roomCode={params.roomCode} ws={ws} />
        </div>
    ) : <div></div>
}

export default RoomCodeIndex;