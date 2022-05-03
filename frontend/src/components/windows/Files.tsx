import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import fuzzysort from 'fuzzysort';
import { Resizable } from 're-resizable';
import styled from 'styled-components';

import { 
  deleteWindow,
  setWindowPosition,
  setZIndex,
  setWindowState,
  setWindowSize,
  setCurrentPath
} from '../../redux/files/actions';

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
import MinecraftWebSocket from '../../lib/MinecraftWebSocket';
import { Disk as DiskType, File, FilesWindow } from '../../redux/files/types';
import withZIndex from './withZIndex';

const FilesMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Disks = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
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
  flex-wrap: wrap;
  max-height: calc(100% - 94px);
  overflow-y: auto;
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
  flex-grow: 1;
`;

const DirectoryHeader = styled.div`
  padding: 10px 10px;
  flex-grow: 1px;
  display: flex;
  column-gap: 10px;
`;

const DirectoryButtons = styled.div`
  display: flex;
  column-gap: 10px;
`;

const DirectoryButton = styled.img`
  height: 24px;
  width: 24px;
  padding: 5px;
  &:hover {
    background-color: #00AF0021;
  }
`;

const DirectoryBar = styled.div`
  flex-grow: 1;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
`;

const DirectoryBarButton = styled.button`
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  transition: 0.2s;
  padding: 0 10px;
  border-right: 1px solid #e5e5e5;
  &:hover {
    background-color: #00AF0021;
  }
`;

const DirectorySearch = styled.div`
  width: 250px;
  border: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
`;

const DirectorySearchIcon = styled.img`
  width: 24px;
  height: 24px;
  padding-left: 5px;
`;

const DirectorySearchInput = styled.input`
  border: none;
  outline: none;
  flex-grow: 1;
  font-size: 14px;
`;

type FilesProps = {
  files: any;
  ws: MinecraftWebSocket;
  moveToTop: (windowType: string, windowId: number) => void;
  getHighestZIndex: () => void;

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

type FilesState = {
  search: string;
}

class Files extends React.Component<FilesProps, FilesState> {
    constructor(props) {
      super(props);

      this.state = {
        search: ''
      }

      this.onMaximiseClick = this.onMaximiseClick.bind(this);
      this.onExitClick = this.onExitClick.bind(this);
      this.onStartFiles = this.onStartFiles.bind(this);
      this.onStopFiles = this.onStopFiles.bind(this);
      this.getWindowSize = this.getWindowSize.bind(this);
      this.resizeWindow = this.resizeWindow.bind(this);
      this.changeDirectory = this.changeDirectory.bind(this);
      this.getImgUrlByType = this.getImgUrlByType.bind(this);
      this.moveBackDirectory = this.moveBackDirectory.bind(this);
      this.dblClickFile = this.dblClickFile.bind(this);
      this.dblClickDisk = this.dblClickDisk.bind(this);
      this.filterFileBySearch = this.filterFileBySearch.bind(this);
    }

    componentDidMount() {
      const { ws, files } = this.props;
      ws.getFilesData(files.id, files.currentPath);
    }

    onMinimiseClick(e) {
      const { files, dispatchSetWindowState } = this.props;
      dispatchSetWindowState(files.id, 'minimised');
    }

    onMaximiseClick(e) {
      const { files, moveToTop, dispatchSetWindowState, dispatchSetWindowPosition } = this.props;
  
      moveToTop('files', files.id);
      dispatchSetWindowPosition(files.id, 0, 0);
      if (files.state === 'maximised') {
        dispatchSetWindowState(files.id, 'windowed')
      } else {
        dispatchSetWindowState(files.id, 'maximised');
      }
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
        moveToTop,
        getHighestZIndex,
        dispatchDeleteWindow,
        dispatchSetWindowState,
        dispatchSetWindowPosition
      } = this.props;
      console.log(files, e, data)
      
      // Set zindex
      if (files.zIndex !== getHighestZIndex()) {
        moveToTop('files', files.id);
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
      console.log(path)
      dispatchSetCurrentPath(files.id, path);
      ws.getFilesData(files.id, path);
    }

    dblClickDisk(e, path: string) {
      if (e.detail === 2) {
        this.changeDirectory(path);
      }
    }

    dblClickFile(e, file: File) {
      const { files } = this.props;
      if (e.detail === 2) {
        if (file.directory) {
          this.changeDirectory(files.currentPath + file.name + '/');
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

    moveBackDirectory(e) {
      const { files } = this.props;
      const pathArr = files.currentPath.split('/');
      const newPath = pathArr.slice(0, pathArr - 1).join('/') + '/';

      this.changeDirectory(newPath)
    }

    
    filterFileBySearch() {
      const { files } = this.props;
      const { search } = this.state;



      if (search) {
        const fuzzyResult = fuzzysort.go(
          search, 
          files.structure, 
          { keys: ['name', 'path'] }
        );
        if (fuzzyResult.length > 0) {
          return fuzzyResult.map((f: any, i) => {console.log(f);return f ? (
            <FilesListItem onClick={(e) => this.dblClickFile(e, f.obj)} key={i}>
              <FilesListItemIcon src={this.getImgUrlByType(f.obj)} alt="Folder"/>
              <FilesListItemText>
                {f.obj.name}
              </FilesListItemText>
            </FilesListItem>
          ) : null})
        } 
        return null;
      }

      return files.structure.map((f: any, i) => (
        <FilesListItem onClick={(e) => this.dblClickFile(e, f)} key={i}>
          <FilesListItemIcon src={this.getImgUrlByType(f)} alt="Folder"/>
          <FilesListItemText>
            {f.name}
          </FilesListItemText>
        </FilesListItem>
      ));
    }

    render() {
      const { files, disks, dispatchSetCurrentPath } = this.props;
      return files.state !== 'minimised' ? (
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
                <Main>
                  <DirectoryHeader>
                    <DirectoryButtons>
                      <DirectoryButton src="/img/back-arrow.png" onClick={this.moveBackDirectory}/>
                      <DirectoryButton src="/img/home-icon.png" onClick={() => this.changeDirectory('/')}/>
                    </DirectoryButtons>
                    <DirectoryBar>
                      <DirectoryBarButton onClick={(e) => this.changeDirectory('/')}>/</DirectoryBarButton>
                      {files.currentPath.split('/').map((p, i) => p ? (
                        <DirectoryBarButton 
                          onClick={(e) => 
                            this.changeDirectory(files.currentPath.split('/').slice(0, i + 1).join('/') + '/')
                          }
                        >
                          {p}
                        </DirectoryBarButton>
                      ) : null)}
                    </DirectoryBar>
                    <DirectorySearch>
                      <DirectorySearchIcon src="/img/magnifying-glass.png" />
                      <DirectorySearchInput 
                        placeholder="Search..." 
                        onChange={(e) => this.setState({ search: e.target.value })} 
                      />
                    </DirectorySearch>
                  </DirectoryHeader>
                  <FilesList>
                    { this.filterFileBySearch() }
                  </FilesList>
                </Main>
              </FilesMain>
            </WindowBody>
          </Resizable>
        </Draggable>
      ) : null;
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
)(withZIndex(Files));