import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';
import Notepad from './windows/Notepad';

type OpenWindowProps = {
  notepad: any;
}

class OpenWindow extends React.Component<OpenWindowProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { notepad } = this.props;
    console.log(notepad)
    return (
      <React.Fragment>
        {notepad.windows.map((notepadWindow) => (
          <Notepad notepad={notepadWindow} />
        ))}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  notepad: state.notepad
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(OpenWindow);