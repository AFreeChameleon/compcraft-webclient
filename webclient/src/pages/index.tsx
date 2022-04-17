import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
`;
    
const Center = styled.div`
    text-align: center;
`;

const Title = styled.div`
    font-size: 100px;
    font-family: Minercraftory;
`;
    
const SubTitle = styled.div`
    font-size: 24px;
`;

const RoomCodeInput = styled.input`
    border: 2px solid #00AF55;
    height: 50px;
    width: 500px;
    outline: none;
    font-size: 24px;
    padding: 0 10px;
    margin-top: 40px;
`;

const GettingStarted = styled.div`
    width: fit-content;
    text-align: left;
    margin: 80px auto 0 auto;
`;

const GettingStartedButton = styled.button`
    width: 250px;
    height: 50px;
    font-size: 24px;
    outline: none;
    border: none;
    background-color: #00AF55;
    color: #ffffff;
    margin-top: 5px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: #007A2A;
    }
`;



function Index() {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');

    const enterRoom = (e) => {
        e.preventDefault();
        router.push(`/code/${roomCode}`)
    }

    return (
        <Root>
            <Center>
                <Title>
                    Sambava
                </Title>
                <SubTitle>
                    A web client for Computer Craft
                </SubTitle>
                <form action="/" method="GET" onSubmit={enterRoom}>
                    <RoomCodeInput 
                        placeholder="Enter room code..." 
                        onChange={(e) => setRoomCode(e.target.value)} 
                    />
                </form>
                <GettingStarted>
                    <div>Need help?</div>
                    <GettingStartedButton>Get Started</GettingStartedButton>
                </GettingStarted>
            </Center>
        </Root>
    )
}

export default Index;