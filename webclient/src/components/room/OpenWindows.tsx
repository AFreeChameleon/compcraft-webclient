import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';
import Notepad from './windows/Notepad';
import Files from './windows/Files';

type OpenWindowProps = {
  notepad: any;
  files: any;
}

class OpenWindow extends React.Component<OpenWindowProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { notepad, files } = this.props;
    console.log(notepad)
    return (
      <React.Fragment>
        {notepad.windows.map((notepadWindow) => (
          <Notepad notepad={notepadWindow} />
        ))}
        {files.windows.map((filesWindow) => (
          <Files files={filesWindow} />
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