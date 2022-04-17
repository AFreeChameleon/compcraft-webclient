import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

import {
  createWindow as createNotepadWindow
} from '../../redux/notepad/actions';

const ShortcutContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;

const Shortcut = styled.div`
  width: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    background-color: blue;
  }
`;

const ShortcutImg = styled.img`
  width: 48px;
`;

const ShortcutText = styled.div`
  text-align: center;
  margin-top: 10px;
`;

type DesktopShortcutsProps = {
  notepad: any;

  dispatchCreateNotepadWindow: (windowProps) => void;
}

class DesktopShortcuts extends React.Component<DesktopShortcutsProps> {
  constructor(props) {
    super(props);
  }

  handleNotepadClick(e) {
    const { 
      notepad, 
      dispatchCreateNotepadWindow 
    } = this.props;

    // Check for double click
    if (e.detail === 2) {
      dispatchCreateNotepadWindow({
        zIndex: 0,
        size: [
            800,
            600
        ],
        position: [
            0,
            0
        ],
        state: 'windowed',
      });
    }
  }

  render() {
    const { 
      notepad, 
      dispatchCreateNotepadWindow 
    } = this.props;

    return (
      <div>
        <ShortcutContainer>
          <Shortcut onClick={this.handleNotepadClick}>
            <ShortcutImg src="/img/notepad.png"/>
            <ShortcutText>Notepad</ShortcutText>
          </Shortcut>
        </ShortcutContainer>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  notepad: state.notepad
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateNotepadWindow: (windowProps) => dispatch(createNotepadWindow(windowProps))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(DesktopShortcuts);