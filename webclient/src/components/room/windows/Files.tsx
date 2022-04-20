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
} from '../../../redux/files/actions';

import {
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

const FilesMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Disks = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  border-right: 1px solid #e5e5e5;
  padding: 10px 0;
`;

const Disk = styled.div`
  line-height: 25px;
  padding: 0 10px;
  &:hover {
    background-color: #00AF0021;
  }
`;

const FilesList = styled.div`
  display: flex;
`;

type FilesProps = {
  files: any;

  // Redux
  windows: any;
  dispatchDeleteWindow: (id: number) => void;
  dispatchSetZIndex: (id: number, zIndex: number) => void;
  dispatchSetWindowPosition: (id: number, x: number, y: number) => void;
  dispatchSetWindowSize: (id: number, width: number, height: number) => void;
  dispatchSetWindowState: (id: number, value: string) => void;
}

class Files extends React.Component<FilesProps> {
    constructor(props) {
      super(props);

      this.onMaximiseClick = this.onMaximiseClick.bind(this);
      this.onExitClick = this.onExitClick.bind(this);
      this.onStartFiles = this.onStartFiles.bind(this);
      this.onStopFiles = this.onStopFiles.bind(this);
      this.getWindowSize = this.getWindowSize.bind(this);
      this.resizeWindow = this.resizeWindow.bind(this);
    }

    onMaximiseClick(e) {
      const { files, dispatchSetWindowState, dispatchSetWindowPosition } = this.props;
  
      dispatchSetWindowPosition(files.id, 0, 0);
      dispatchSetWindowState(files.id, 'maximised');
    }
  
    onExitClick(e) {
      const { files, dispatchDeleteWindow } = this.props;
  
      dispatchDeleteWindow(files.id);
    }

    getWindowSize() {
      const { files, dispatchSetWindowPosition } = this.props;
  
      switch (files.state) {
        case 'windowed':
          return {
            width: files.size[0],
            height: files.size[1],
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

    onStartFiles(e, data) {
      const { 
        files, 
        windows, 
        dispatchDeleteWindow, 
        dispatchSetZIndex,
        dispatchSetWindowState,
        dispatchSetWindowPosition
      } = this.props;
      console.log(files, e, data)
      
      // Set zindex
      if (files.zIndex !== Math.max(...windows.map((w) => w.zIndex))) {
        dispatchSetZIndex(files.id, Math.max(...windows.map((w) => w.zIndex)) + 1);
      }
  
      if (files.state !== 'windowed') {
        dispatchSetWindowState(files.id, 'windowed');
        dispatchSetWindowPosition(files.id, e.clientX - (files.size[0] / 2), e.clientY - 15);
      }
    }
  
    onStopFiles(e, data) {
      const { files, dispatchSetWindowPosition } = this.props;
      console.log(e, data);
      dispatchSetWindowPosition(files.id, data.x, data.y);
    }

    resizeWindow(e, direction, ref, d) {
      const { files, dispatchSetWindowSize } = this.props;
  
      dispatchSetWindowSize(files.id, files.size[0] + d.width, files.size[1] + d.height);
    }

    render() {
      const { files } = this.props;
      return (
        <Draggable
          handle={`#files-header-${files.id}`}
          position={{
            x: files.position[0],
            y: files.position[1]
          }}
          // ! NEED TO SET BOUNDS to stop dragging beyond taskbar
          // bounds={{
          //   bottom: 60
          // }}
          onStart={this.onStartFiles}
          onStop={this.onStopFiles}
        >
          <Resizable 
            size={{
              ...this.getWindowSize()
            }}
            enable={files.state === 'windowed' ? ({
              right: true,
              bottom: true,
              bottomRight: true
            }) : ({})}
            style={{
              zIndex: files.zIndex,
              border: '1px solid #00AF00',
              position: 'absolute',
              userSelect: 'none',
            }}
            onResizeStop={this.resizeWindow}
          >
            <WindowHeader>
              <WindowHeaderText id={`files-header-${files.id}`}>
                Files
              </WindowHeaderText>
              <WindowOptions>
                <WindowButton className="minimise"></WindowButton>
                <WindowButton className="maximise" onClick={this.onMaximiseClick}></WindowButton>
                <WindowButton className="exit" onClick={this.onExitClick}></WindowButton>
              </WindowOptions>
            </WindowHeader>
            <WindowBody>
              <FilesMain>
                <Disks>
                  <Disk>/</Disk>
                  <Disk>disk/</Disk>
                </Disks>
                <FilesList>

                </FilesList>
              </FilesMain>
            </WindowBody>
          </Resizable>
        </Draggable>
      );
    }
}

const mapStateToProps = (state) => ({
  windows: state.files.windows
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
)(Files);