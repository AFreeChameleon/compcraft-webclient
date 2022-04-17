import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

type OpenWindowProps = {
  notepad: any;
}

class OpenWindow extends React.Component<OpenWindowProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { notepad } = this.props;
    
    return (
      <div>

      </div>
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