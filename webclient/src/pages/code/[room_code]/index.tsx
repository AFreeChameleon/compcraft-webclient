import React from 'react';
import { io } from 'socket.io-client';
import Toolbar from '../../../components/Toolbar';

type RoomCodeIndexProps = {
    roomCode: string;
}

// const socket = io('http://localhost:8000');

function RoomCodeIndex({ roomCode }: RoomCodeIndexProps) {
    console.log(roomCode);
    return (
        <div>
            <Toolbar />
        </div>
    )
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