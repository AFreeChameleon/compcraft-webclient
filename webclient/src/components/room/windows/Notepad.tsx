import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import styled from 'styled-components';

import { 
  deleteWindow,
  setWindowPosition
} from '../../../redux/notepad/actions';

const Root = styled.div`
  position: absolute;
  user-select: none;
  border: 1px solid #00AF00;
`;

const WindowHeader = styled.div`
  width: 100%;
  height: 30px;
  background-color: #00AF00;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

const WindowHeaderText = styled.div`
  display: flex;
  flex-grow: 1;
  column-gap: 15px;
  align-items: center;
  height: 100%;
  color: #ffffff;
  padding-left: 15px;
`;

const WindowOptions = styled.div`
  display: flex;
`;

const WindowButton = styled.div`
  height: 100%;
  width: 40px;
  display: grid;
  place-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30%;
  user-select: contain;

  &.minimise {
    background-image: url('/img/minimise.png');
  }
  &.maximise {
    background-image: url('/img/maximise.png');
  }
  &.exit {
    background-image: url('/img/exit.png');
  }

  &:hover {
    background-color: #007A2A;
  }
`;

const WindowBody = styled.div`
  width: 100%;
  height: calc(100% - 30px);
`;


const Options = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 2px solid #e5e5e5;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const Option = styled.div`


`;

const OptionText = styled.div`
  padding: 0 5px;
  line-height: 20px;
  &:hover {
    background-color: #00AF00;
    color: #ffffff;
  }
`;

const OptionMenu = styled.div`
  position: absolute;
  left: 8px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  color: #000000;
  width: 200px;
`;

const OptionMenuItem = styled.div`
  line-height: 20px;
  padding: 0 5px;
  &:hover {
    background-color: #00AF0021;
  }
`;

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
  dispatchDeleteWindow: (id: number) => void;
  dispatchSetWindowPosition: (id: number, x: number, y: number) => void;
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
    this.onExitClick = this.onExitClick.bind(this);
    this.onOptionMenuClick = this.onOptionMenuClick.bind(this);
  }

  onDragNotepad(e, data) {
    const { notepad } = this.props;
  }

  onStartNotepad(e, data) {
    const { notepad, dispatchDeleteWindow } = this.props;
    console.log(notepad)
  }

  onStopNotepad(e, data) {
    const { notepad, dispatchSetWindowPosition } = this.props;
    console.log(e, data);
    dispatchSetWindowPosition(notepad.id, data.x, data.y);
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
          <Root style={{
            width: notepad.size[0],
            height: notepad.size[1],
            zIndex: notepad.zIndex
          }}>
            <WindowHeader>
              <WindowHeaderText id={`notepad-header-${notepad.id}`}>
                {notepad.file.name || 'Untitled'} {notepad.file.path ? `- [${notepad.file.path}]` : ''}
              </WindowHeaderText>
              <WindowOptions>
                <WindowButton className="minimise"></WindowButton>
                <WindowButton className="maximise"></WindowButton>
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
          </Root>
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  dispatchDeleteWindow: (id: number) => dispatch(deleteWindow(id)),
  dispatchSetWindowPosition: (id: number, x: number, y: number) => dispatch(setWindowPosition(id, x, y))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Notepad);