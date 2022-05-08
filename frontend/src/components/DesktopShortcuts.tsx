import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

import {
  createWindow as createNotepadWindow
} from '../redux/notepad/actions';
import {
  createWindow as createFilesWindow
} from '../redux/files/actions';
import OpenWindows from './OpenWindows';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  padding: 10px
`;

const ShortcutContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  cursor: default;
`;

const Shortcut = styled.div`
  width: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;
  border: 1px solid transparent;
  &:hover {
    background-color: #00AF0021;
    border: 1px solid #00AF00;
  }
`;

const ShortcutImg = styled.img`
  width: 48px;
`;

const ShortcutText = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
`;

type DesktopShortcutsProps = {
  notepad: any;
  files: any;

  dispatchCreateNotepadWindow: (windowProps) => void;
  dispatchCreateFilesWindow: (windowProps) => void;
}

class DesktopShortcuts extends React.Component<DesktopShortcutsProps> {
  constructor(props) {
    super(props);

    this.handleNotepadClick = this.handleNotepadClick.bind(this);
    this.handleFilesClick = this.handleFilesClick.bind(this);
    this.getHighestZIndex = this.getHighestZIndex.bind(this);
  }

  getHighestZIndex() {
    const { 
      notepad, 
      files 
    } = this.props;

    if (Math.max(
      ...notepad.windows.map((w) => w.zIndex), 
      ...files.windows.map((w) => w.zIndex)
    ) === -Infinity) {
      return 0;
    }
    return Math.max(
      ...notepad.windows.map((w) => w.zIndex), 
      ...files.windows.map((w) => w.zIndex)
    );
  }

  handleNotepadClick(e) {
    const { 
      notepad, 
      dispatchCreateNotepadWindow 
    } = this.props;
    // Check for double click
    if (e.detail === 2) {
      dispatchCreateNotepadWindow({
        zIndex: this.getHighestZIndex() + 1,
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
  }

  handleFilesClick(e) {
    const {
      files,
      dispatchCreateFilesWindow
    } = this.props;

    if (e.detail === 2) {
      dispatchCreateFilesWindow({
        zIndex: this.getHighestZIndex() + 1,
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
  }

  render() {
    const { 
      notepad,  
    } = this.props;
    console.log(notepad)
    return (
      <Root>
        <ShortcutContainer>
          <Shortcut onClick={this.handleNotepadClick}>
            <ShortcutImg src="/img/notepad.png"/>
            <ShortcutText>Notepad</ShortcutText>
          </Shortcut>
        </ShortcutContainer>
        <ShortcutContainer>
          <Shortcut onClick={this.handleFilesClick}>
            <ShortcutImg src="/img/folder.png"/>
            <ShortcutText>Files</ShortcutText>
          </Shortcut>
        </ShortcutContainer>
      </Root>
    )
  }
}

const mapStateToProps = (state) => ({
  notepad: state.notepad,
  files: state.files
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateNotepadWindow: (windowProps) => dispatch(createNotepadWindow(windowProps)),
  dispatchCreateFilesWindow: (windowProps) => dispatch(createFilesWindow(windowProps))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(DesktopShortcuts);