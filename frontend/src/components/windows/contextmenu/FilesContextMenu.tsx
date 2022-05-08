import React from 'react';
import styled from 'styled-components';

import store from '../../../redux/store';
import MinecraftWebSocket from '../../../lib/MinecraftWebSocket';


const WindowMenu = styled.div`
  position: absolute;
  width: 200px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
`;

const WindowMenuItem = styled.div`
  padding: 5px 8px;
  font-size: 14px;
  &:hover {
    background-color: #e5e5e5;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
`;

const Modal = styled.form`
  position: absolute;
  top: calc(50% - 100px);
  left: calc(50% - 200px);
  width: 400px;
  height: 200px;
  background-color: #ffffff;
  padding: 15px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.div`
  font-size: 18px;
`;

const ModalInput = styled.input`
  margin-top: 50px;
  border: 2px solid #00AF55;
  height: 30px;
  outline: none;
  font-size: 16px;
  padding: 0 10px;
  margin-top: 40px;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const ModalButton = styled.button`
    width: 100px;
    height: 30px;
    font-size: 14px;
    outline: none;
    border: none;
    background-color: #00AF55;
    color: #ffffff;
    margin-top: 5px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: #007A2A;
    }
`;

type FilesContextMenuProps = {
    files: any;
    ws: MinecraftWebSocket;
}

type FilesContextMenuState = {
    modal: {
        open: boolean;
        type?: string;
        values: {
          newFile: string;
          newFolder: string;
        }
    };
    contextMenu: {
      open: boolean;
      top: number;
      left: number;
      type: 'window' | 'dirItemFolder' | 'dirItemFile' | null;
      selectedFile?: {
        name: string;
        isDir: boolean;
      };
    }
}

class FilesContextMenu extends React.Component<FilesContextMenuProps, FilesContextMenuState> {
    constructor(props) {
        super(props);

        this.state = {
            modal: {
                open: false,
                type: null,
                values: {
                  newFile: '',
                  newFolder: ''
                }
            },
            contextMenu: {
              open: false,
              top: 0,
              left: 0,
              type: 'window'
            }
        }

        this.createCustomMenuEvent = this.createCustomMenuEvent.bind(this);
        this.openWindowContextMenu = this.openWindowContextMenu.bind(this);
        this.openDirItemContextMenu = this.openDirItemContextMenu.bind(this);
        this.renderContextMenu = this.renderContextMenu.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.createFile = this.createFile.bind(this);
    }

    componentDidMount() {
        this.createCustomMenuEvent();
    }

    createCustomMenuEvent() {
        const { files } = this.props;
        const { modal } = this.state;
        const windowEl = document.getElementById(`files-${files.id}`);
        window.addEventListener('contextmenu', (e) => {
            const modalEl = document.getElementById(`files-modal-${files.id}`)
            if (windowEl.contains(e.target as any) && !modalEl) {
              e.preventDefault();
              const fileWindow = store.getState().files.windows.find(w => w.id === files.id);
              const fileElList = Array.from(document.getElementsByClassName('file-item'));
              for (const f of fileElList) {
                if (f.contains(e.target as any)) {
                  const name = f.id.substring('file-item-name-'.length);
                  const isDir = f.classList.contains('file-item-directory');
                  this.setState({
                    contextMenu: {
                      open: true,
                      top: e.clientY - fileWindow.position[1],
                      left: e.clientX - fileWindow.position[0],
                      type: isDir ? 
                        'dirItemFolder' : 'dirItemFile',
                      selectedFile: {
                        name: name,
                        isDir: isDir
                      }
                    }
                  });
                  return;
                }
              }
              this.setState({
                contextMenu: {
                  open: true,
                  top: e.clientY - fileWindow.position[1],
                  left: e.clientX - fileWindow.position[0],
                  type: 'window',
                  selectedFile: null
                }
              });
            }
        });
        window.addEventListener('mousedown', (e) => {
          const contextMenuEl = document.getElementById(`files-${files.id}-contextmenu`);
          if (contextMenuEl) {
            this.setState({
              contextMenu: {
                open: false,
                top: 0,
                left: 0,
                type: null,
                selectedFile: null
              }
            })
          }
        });
        windowEl.addEventListener('click', (e) => {
          const modalEl = document.getElementById(`files-modal-${files.id}`)
          if (modalEl && e.target === modalEl) {
            this.setState({
              modal: {
                ...modal,
                open: false,
              }
            })
          }
        })
    }
    
    openWindowContextMenu() {
        const { files } = this.props;
        const { contextMenu, modal } = this.state;
        return (
            <WindowMenu id={`files-${files.id}-contextmenu`} style={{
                top: contextMenu.top + 'px',
                left: contextMenu.left + 'px'
            }}>
                <WindowMenuItem
                  onMouseDown={(e) => this.setState({
                    modal: {
                      ...modal,
                      open: true,
                      type: 'newFile'
                    }
                  })}
                >
                  New File
                </WindowMenuItem>
                <WindowMenuItem
                  onMouseDown={(e) => this.setState({
                    modal: {
                      ...modal,
                      open: true,
                      type: 'newFolder'
                    }
                  })}
                >
                  New Folder
                </WindowMenuItem>
            </WindowMenu>
        );
    }

    openDirItemContextMenu(folder: boolean) {
        const { files } = this.props;
        const { contextMenu, modal } = this.state;
        return (
            <WindowMenu id={`files-${files.id}-contextmenu`} style={{
                top: contextMenu.top + 'px',
                left: contextMenu.left + 'px'
            }}>
                <WindowMenuItem>Open</WindowMenuItem>
                {!folder && <WindowMenuItem>Edit</WindowMenuItem>}
                <WindowMenuItem>Rename</WindowMenuItem>
                <WindowMenuItem>Delete</WindowMenuItem>
            </WindowMenu>
        );
    }

    renderContextMenu() {
        const { contextMenu, modal } = this.state;
        console.log(contextMenu)
        if (contextMenu.type === 'window') {
            return this.openWindowContextMenu();
        }
        if (contextMenu.type === 'dirItemFolder' || contextMenu.type === 'dirItemFile') {
            return this.openDirItemContextMenu(contextMenu.type === 'dirItemFolder');
        }
    }

    setModalValue(key: 'newFile' | 'newFolder', value: any) {
      const { modal } = this.state;

      this.setState({
        modal: {
          ...modal,
          values: {
            ...modal.values,
            [key]: value
          }
        }
      })
    }

    createFile(e) {
      e.preventDefault();
      const { files, ws } = this.props;
      const { modal } = this.state;
      const fileName = modal.values.newFile;
      const path = files.currentPath;
      
      ws.createFile(path, fileName || 'Untitled');
      this.setState({
        modal: {
          ...modal,
          open: false
        }
      });
    }

    renderModal() {
      const type = this.state.modal.type;
      if (type === 'newFile') {
        return (
          <Modal action="/" method="POST" onSubmit={this.createFile}>
            <ModalTitle>New File</ModalTitle>
            <ModalInput 
              autoFocus
              placeholder="File name..." 
              defaultValue="Untitled" 
              onChange={(e) => this.setModalValue('newFile', e.target.value)} 
            />
            <FlexGrow />
            <ModalButton type="submit">New</ModalButton>
          </Modal>
        );
      } else if (type === 'newFolder') {
        return (
          <Modal action="/" method="POST">
            <ModalTitle>New Folder</ModalTitle>
            <ModalInput 
              ref={inputElement => {
                // constructs a new function on each render
                if (inputElement) {
                  inputElement.select();
                }
              }}
              placeholder="Folder name..." 
              defaultValue="Untitled" 
              onChange={(e) => this.setModalValue('newFile', e.target.value)} 
            />
            <FlexGrow />
            <ModalButton type="submit">New</ModalButton>
          </Modal>
        )
      }
    }

    render() {
        const { files } = this.props;
        const { contextMenu, modal } = this.state;

        return <>
            {contextMenu.open && this.renderContextMenu()}
            {modal.open && (
                <ModalContainer id={`files-modal-${files.id}`}>
                    {this.renderModal()}
                </ModalContainer>
            )}
        </>
        
    }
}

export default FilesContextMenu;