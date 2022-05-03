import React from 'react';

import styled from 'styled-components';

const Root = styled.div`
    position: absolute;
    bottom: 50px;
`;
    
const Window = styled.div`
    background-color: #e5e5e5;
    width: 250px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    margin-bottom: 5px;
    &:last-child {
        margin-bottom: 0px;
    }
`;

const WindowTitle = styled.div`

`;

const WindowCloseButton = styled.img`
    height: 8px;
    width: 8px;
    padding: 5px;
    background-color: #dc3545;
    &:hover {
        background-color: #9c2525;
    }
`;

type WindowTooltipsProps = {
    windows: Array<{
        id: number;
        name: string;
    }>;
    deleteWindow: (id: number) => void;
}

class WindowTooltips extends React.Component<WindowTooltipsProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { 
            windows,
            deleteWindow 
        } = this.props;

        return (
            <Root>
                { windows.map((w) => <Window>
                    <WindowTitle>{w.name}</WindowTitle>
                    <WindowCloseButton 
                        src="/img/exit.png"
                        onClick={() => deleteWindow(w.id)}
                    />
                </Window> )}
            </Root>
        )
    }
}

export default WindowTooltips;