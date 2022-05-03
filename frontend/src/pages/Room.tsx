import React, {useEffect, useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RoomMain from '../components/RoomMain';
import MinecraftWebSocket from '../lib/MinecraftWebSocket';

type RoomCodeIndexProps = {
    roomCode: string;
}

type RouteParams = {
    roomCode: string;
}

function RoomCodeIndex() {
    let [ws, setWs] = useState(null);
    const params = useParams<RouteParams>();
    useEffect(() => {
        const connection = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_HOST);
        const websocket = new MinecraftWebSocket(connection, params.roomCode);
        setWs(websocket);
    }, []);
    return ws ? (
        <div>
            <RoomMain roomCode={params.roomCode} ws={ws} />
        </div>
    ) : <div></div>
}

RoomCodeIndex.getInitialProps = async (ctx) => {
    try {
        const roomCode = ctx.query.room_code;
        return {
            roomCode: roomCode
        }
    } catch(err) {
        console.log('Error', err);
        return {
            roomCode: null
        }
    }
};

export default RoomCodeIndex;