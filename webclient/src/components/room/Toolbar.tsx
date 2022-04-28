import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
    createWindow as createNotepadWindow
} from '../../redux/notepad/actions';

import {
    createWindow as createFilesWindow
} from '../../redux/files/actions';

import withZIndex from './windows/withZIndex';

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

const ApplicationTray = styled.div`
    margin-left: 30px;
    display: flex;
    height: 100%;
`;

const ApplicationIcon = styled.div`
    width: 50px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
    &:hover {
        background-color: #00AF0021;
    }
`;

type ToolbarProps = {
    window: {
        notepad: any;
        files: any;
    };

    dispatchCreateNotepadWindow: (windowProps) => void;
    dispatchCreateFilesWindow: (windowProps) => void;
    getHighestZIndex: () => number;
}

class Toolbar extends React.Component<ToolbarProps> {
    constructor(props) {
        super(props);

        this.openNotepad = this.openNotepad.bind(this);
        this.openFiles = this.openFiles.bind(this);
    }

    openNotepad() {
        const {
            window,
            getHighestZIndex,
            dispatchCreateNotepadWindow
        } = this.props;

        dispatchCreateNotepadWindow({
            zIndex: getHighestZIndex() + 1,
            size: [
                800,
                600
            ],
            position: [
                0,
                0
            ],
            state: 'windowed',
            file: {
              name: '',
              path: '',
              content: ''
            }
        });
    }

    openFiles() {
        const {
            getHighestZIndex,
            dispatchCreateFilesWindow
          } = this.props;
      
        dispatchCreateFilesWindow({
            zIndex: getHighestZIndex() + 1,
            size: [
                800,
                600
            ],
            position: [
                0,
                0
            ],
            state: 'windowed',
            currentPath: '/',
            structure: []
        });
    }

    render() {
        const {
            window
        } = this.props;

        return (
            <Root>
                <StartButton>
                    <StartButtonIcon src="/img/grass_block.png" alt="Start" />
                    <div>
                        Start
                    </div>
                </StartButton>
                <ApplicationTray>
                    <ApplicationIcon 
                        onMouseUp={this.openNotepad}
                        style={{
                            backgroundImage: `url('/img/notepad.png')`,
                            borderBottom: window.notepad.windows.length > 0 ? '2px solid #00AF00' : 'none'
                        }}
                    ></ApplicationIcon>
                    <ApplicationIcon 
                        onMouseUp={this.openFiles}
                        style={{
                            backgroundImage: `url('/img/folder.png')`
                        }}
                    ></ApplicationIcon>
                </ApplicationTray>
            </Root>
        )
    }
}

const mapStateToProps = (state) => ({
    window: {
        files: state.files,
        notepad: state.notepad
    }
});

const mapDispatchToProps = (dispatch) => ({
    dispatchCreateNotepadWindow: (windowProps) => dispatch(createNotepadWindow(windowProps)),
    dispatchCreateFilesWindow: (windowProps) => dispatch(createFilesWindow(windowProps))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(withZIndex(Toolbar));