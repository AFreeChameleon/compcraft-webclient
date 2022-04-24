import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import styled from 'styled-components';

import { 
  deleteWindow,
  setWindowPosition,
  setZIndex,
  setWindowState,
  setWindowSize
} from '../../../redux/notepad/actions';

import {
  Root,
  WindowHeader,
  WindowHeaderText,
  WindowButton,
  WindowOptions,
  WindowBody,
  Options,
  Option,
  OptionText,
  OptionMenu,
  OptionMenuItem
} from './WindowTemplates';
import MinecraftWebSocket from '../../../lib/MinecraftWebSocket';

const NotepadTextarea = styled.textarea`
  width: 100%;
  height: calc(100% - 30px);
  border: none;
  outline: none;
  padding: 0;
  resize: none;
  padding: 0 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

type NotepadProps = {
  notepad: any;
  ws: MinecraftWebSocket;

  // Redux
  windows: any;
  dispatchDeleteWindow: (id: number) => void;
  dispatchSetZIndex: (id: number, zIndex: number) => void;
  dispatchSetWindowPosition: (id: number, x: number, y: number) => void;
  dispatchSetWindowSize: (id: number, width: number, height: number) => void;
  dispatchSetWindowState: (id: number, value: string) => void;
}

type NotepadState = {
  menuOpen: null | string;
}

class Notepad extends React.Component<NotepadProps, NotepadState> {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: null
    }

    this.onDragNotepad = this.onDragNotepad.bind(this);
    this.onStopNotepad = this.onStopNotepad.bind(this);
    this.onStartNotepad = this.onStartNotepad.bind(this);
    this.onMaximiseClick = this.onMaximiseClick.bind(this);
    this.onExitClick = this.onExitClick.bind(this);
    this.onOptionMenuClick = this.onOptionMenuClick.bind(this);
    this.getWindowSize = this.getWindowSize.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
  }

  onDragNotepad(e, data) {
    const { notepad } = this.props;
  }

  onStartNotepad(e, data) {
    const { 
      notepad, 
      windows, 
      dispatchDeleteWindow, 
      dispatchSetZIndex,
      dispatchSetWindowState,
      dispatchSetWindowPosition
    } = this.props;
    console.log(notepad, e, data)
    
    // Set zindex
    if (notepad.zIndex !== Math.max(...windows.map((w) => w.zIndex))) {
      dispatchSetZIndex(notepad.id, Math.max(...windows.map((w) => w.zIndex)) + 1);
    }

    if (notepad.state !== 'windowed') {
      dispatchSetWindowState(notepad.id, 'windowed');
      dispatchSetWindowPosition(notepad.id, e.clientX - (notepad.size[0] / 2), e.clientY - 15);
    }
  }

  onStopNotepad(e, data) {
    const { notepad, dispatchSetWindowPosition } = this.props;
    console.log(e, data);
    dispatchSetWindowPosition(notepad.id, data.x, data.y);
  }

  onMaximiseClick(e) {
    const { notepad, dispatchSetWindowState, dispatchSetWindowPosition } = this.props;

    dispatchSetWindowPosition(notepad.id, 0, 0);
    dispatchSetWindowState(notepad.id, 'maximised');
  }

  onExitClick(e) {
    const { notepad, dispatchDeleteWindow } = this.props;

    dispatchDeleteWindow(notepad.id);
  }

  onOptionMenuClick(menu: string) {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: menuOpen === menu ? null : menu });
    
    let ignoreClickEl = document.getElementById(menu + '-menu');
    let ignoreClickButtonEl = document.getElementById(menu + '-menu-button');
    document.addEventListener('mousedown', (event: any) => {
      let isClickInsideElement = ignoreClickEl.contains(event.target) || ignoreClickButtonEl.contains(event.target);
      if (!isClickInsideElement) {
        this.setState({ menuOpen: null });
      }
    });
  }

  getWindowSize() {
    const { notepad, dispatchSetWindowPosition } = this.props;

    switch (notepad.state) {
      case 'windowed':
        return {
          width: notepad.size[0],
          height: notepad.size[1],
        }
      case 'maximised':
        return {
          width: '100%',
          height: '100%'
        }
      default:
        return {
          width: 0,
          height: 0
        };
    }
  }

  resizeWindow(e, direction, ref, d) {
    const { notepad, dispatchSetWindowSize } = this.props;

    dispatchSetWindowSize(notepad.id, notepad.size[0] + d.width, notepad.size[1] + d.height);
  }

  render() {
    const { notepad } = this.props;
    const { menuOpen } = this.state;
    // console.log(notepad)
    return (
      <Draggable
        handle={`#notepad-header-${notepad.id}`}
        position={{
          x: notepad.position[0],
          y: notepad.position[1]
        }}
        // ! NEED TO SET BOUNDS to stop dragging beyond taskbar
        // bounds={{
        //   bottom: 60
        // }}
        onStart={this.onStartNotepad}
        onStop={this.onStopNotepad}
      >
        <Resizable 
          size={{
            ...this.getWindowSize()
          }}
          enable={notepad.state === 'windowed' ? ({
            right: true,
            bottom: true,
            bottomRight: true
          }) : ({})}
          style={{
            zIndex: notepad.zIndex,
            border: '1px solid #00AF00',
            position: 'absolute',
            userSelect: 'none',
          }}
          onResizeStop={this.resizeWindow}
        >
          <WindowHeader>
            <WindowHeaderText id={`notepad-header-${notepad.id}`}>
              {notepad.file.name || 'Untitled'} {notepad.file.path ? `- [${notepad.file.path}]` : ''}
            </WindowHeaderText>
            <WindowOptions>
              <WindowButton className="minimise"></WindowButton>
              <WindowButton className="maximise" onClick={this.onMaximiseClick}></WindowButton>
              <WindowButton className="exit" onClick={this.onExitClick}></WindowButton>
            </WindowOptions>
          </WindowHeader>
          <WindowBody>
            <Options>
              <Option>
                <OptionText 
                  id="file-menu-button"
                  onClick={(e) => this.onOptionMenuClick('file')}
                >
                  File
                </OptionText>
                <OptionMenu id="file-menu" style={{
                  display: menuOpen === 'file' ? 'block' : 'none'
                }}>
                  <OptionMenuItem>New</OptionMenuItem>
                  <OptionMenuItem>Save</OptionMenuItem>
                  <OptionMenuItem>Save As</OptionMenuItem>
                  <OptionMenuItem>Open</OptionMenuItem>
                </OptionMenu>
              </Option>
            </Options>
            <NotepadTextarea resize="none"></NotepadTextarea>
          </WindowBody>
        </Resizable>
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => ({
  windows: state.notepad.windows
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDeleteWindow: (id: number) => dispatch(deleteWindow(id)),
  dispatchSetWindowPosition: (id: number, x: number, y: number) => dispatch(setWindowPosition(id, x, y)),
  dispatchSetWindowSize: (id: number, width: number, height: number) => dispatch(setWindowSize(id, width, height)),
  dispatchSetZIndex: (id: number, zIndex: number) => dispatch(setZIndex(id, zIndex)),
  dispatchSetWindowState: (id: number, value: string) => dispatch(setWindowState(id, value))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Notepad);