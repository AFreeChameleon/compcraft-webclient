import React, {useEffect, useState} from 'react';
import RoomMain from '../../../components/room/RoomMain';

type RoomCodeIndexProps = {
    roomCode: string;
}

function RoomCodeIndex({ roomCode }: RoomCodeIndexProps) {
    let [ws, setWs] = useState(null);
    useEffect(() => {
        const connection = new WebSocket('ws://localhost:8000');
        setWs(connection);
    }, []);
    return ws ? (
        <div>
            <RoomMain roomCode={roomCode} ws={ws} />
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