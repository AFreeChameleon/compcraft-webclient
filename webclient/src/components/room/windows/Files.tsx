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
  setWindowSize,
  setCurrentPath
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
import MinecraftWebSocket from '../../../lib/MinecraftWebSocket';
import { Disk as DiskType, File, FilesWindow } from '../../../redux/files/types';

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

const DiskTitle = styled.div`
  line-height: 25px;
  padding: 0 10px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
`;

const Disk = styled.div`
  line-height: 25px;
  padding: 0 10px;
  font-size: 14px;
  &:hover {
    background-color: #00AF0021;
  }
`;

const FilesList = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  column-gap: 10px;
`;

const FilesListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 5px;
  width: 70px;
  padding: 5px 0;
  &:hover {
    background-color: #00AF0021;
  }
`;

const FilesListItemIcon = styled.img`

`;

const FilesListItemText = styled.div`
  font-size: 14px;
  word-wrap: break-word;
  width: 100%;
  text-align: center;
`;

const Main = styled.div`

`;

const DirectoryHeader = styled.div`

`;

type FilesProps = {
  files: any;
  ws: MinecraftWebSocket;

  // Redux
  windows: FilesWindow[];
  disks: DiskType[];
  dispatchDeleteWindow: (id: number) => void;
  dispatchSetZIndex: (id: number, zIndex: number) => void;
  dispatchSetWindowPosition: (id: number, x: number, y: number) => void;
  dispatchSetWindowSize: (id: number, width: number, height: number) => void;
  dispatchSetWindowState: (id: number, value: string) => void;
  dispatchSetCurrentPath: (id: number, value: string) => void;
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
      this.changeDirectory = this.changeDirectory.bind(this);
      this.getImgUrlByType = this.getImgUrlByType.bind(this);
      this.dblClickFile = this.dblClickFile.bind(this);
      this.dblClickDisk = this.dblClickDisk.bind(this);
    }

    componentDidMount() {
      const { ws, files } = this.props;
      console.log(files)
      ws.getFilesData(files.id, files.currentPath);
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

    changeDirectory(path: string) {
      const { files, ws, dispatchSetCurrentPath } = this.props;

      dispatchSetCurrentPath(files.id, path);
      ws.getFilesData(files.id, path);
    }

    dblClickDisk(e, path: string) {
      if (e.detail === 2) {
        this.changeDirectory(path);
      }
    }

    dblClickFile(e, file: File) {
      if (e.detail === 2) {
        if (file.directory) {
          this.changeDirectory(file.name + '/');
        } else {
          // If file is text, open notepad else give alert saying file type is unsupported and ask before opening in notepad
        }
      }
    }

    getImgUrlByType(file: File) {
      const { disks } = this.props;
      if (file.directory) {
        console.log(disks, file)
        if (disks.map(d => d.path).includes(file.name)) {
          return '/img/disk-drive.png';
        }
        return '/img/folder-vertical.png';
      }
      if (file.name.substring(file.name.length - 4) === '.lua') {
        return '/img/lua-file.png';
      }
      return '/img/unknown-file.png';
    }

    render() {
      const { files, disks, dispatchSetCurrentPath } = this.props;
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
                  <DiskTitle>Drives</DiskTitle>
                  <Disk 
                    onClick={(e) => this.dblClickDisk(e, '/')}
                  >
                    /
                  </Disk>
                  {disks.map((d) => (
                    <Disk 
                      onClick={(e) => this.dblClickDisk(e, d.path + '/')}
                    >
                      {d.path}/
                    </Disk>
                  ))}
                </Disks>
                <Main>
                  <DirectoryHeader></DirectoryHeader>
                  <FilesList>
                    { files.structure.map((f) => (
                      <FilesListItem onClick={(e) => this.dblClickFile(e, f)}>
                        <FilesListItemIcon src={this.getImgUrlByType(f)} alt="Folder"/>
                        <FilesListItemText>
                          {f.name}
                        </FilesListItemText>
                      </FilesListItem>
                    )) }
                  </FilesList>
                </Main>
              </FilesMain>
            </WindowBody>
          </Resizable>
        </Draggable>
      );
    }
}

const mapStateToProps = (state) => ({
  windows: state.files.windows,
  disks: state.files.disks
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDeleteWindow: (id: number) => dispatch(deleteWindow(id)),
  dispatchSetWindowPosition: (id: number, x: number, y: number) => dispatch(setWindowPosition(id, x, y)),
  dispatchSetWindowSize: (id: number, width: number, height: number) => dispatch(setWindowSize(id, width, height)),
  dispatchSetZIndex: (id: number, zIndex: number) => dispatch(setZIndex(id, zIndex)),
  dispatchSetWindowState: (id: number, value: string) => dispatch(setWindowState(id, value)),

  dispatchSetCurrentPath: (id: number, value: string) => dispatch(setCurrentPath(id, value))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Files);