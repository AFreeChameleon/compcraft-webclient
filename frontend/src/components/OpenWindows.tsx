import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';
import Notepad from './windows/Notepad';
import Files from './windows/Files';
import MinecraftWebSocket from '../lib/MinecraftWebSocket';

type OpenWindowProps = {
  notepad: any;
  files: any;
  ws: MinecraftWebSocket;
}

class OpenWindow extends React.Component<OpenWindowProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { notepad, files, ws } = this.props;
    return (
      <React.Fragment>
        {notepad.windows.map((notepadWindow, i) => (
          <Notepad notepad={notepadWindow} ws={ws} key={i} />
        ))}
        {files.windows.map((filesWindow, i) => (
          <Files files={filesWindow} ws={ws} key={i} />
        ))}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  notepad: state.notepad,
  files: state.files
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(OpenWindow);