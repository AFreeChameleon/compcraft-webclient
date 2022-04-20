import React from "react";
import styled from 'styled-components';

const Root = styled.div`
    width: 100%;
    height: 50px;
    border-top: 1px solid #00AF00;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    z-index: 1000000;
    background-color: #ffffff;
`;

const StartButton = styled.button`
    height: 40px;
    display: flex;
    align-items: center;
    column-gap: 10px;
    border: 2px solid #00AF00;
    background-color: #ffffff;
    cursor: pointer;
`;

const StartButtonIcon = styled.img`
    height: 20px;
    width: 20px;
`;

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Root>
                <StartButton>
                    <StartButtonIcon src="/img/grass_block.png" alt=" " />
                    <div>
                        Start
                    </div>
                </StartButton>
            </Root>
        )
    }
}

export default Toolbar;