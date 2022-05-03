import React from 'react';
import MinecraftWebSocket from '../lib/MinecraftWebSocket';
import DesktopShortcuts from './DesktopShortcuts';
import OpenWindows from './OpenWindows';
import Toolbar from './Toolbar';

type RoomMainProps = {
  roomCode: string;
  ws: MinecraftWebSocket;
}

type RoomMainState = {
  connected: boolean;
}

class RoomMain extends React.Component<RoomMainProps, RoomMainState> {
  constructor(props) {
    super(props);
    this.state = {
      connected: false
    }

    this.addConnectionEvents = this.addConnectionEvents.bind(this);
  }

  componentDidMount() {
    this.addConnectionEvents();
  }

  addConnectionEvents() {
    const { ws, roomCode } = this.props;
    ws.socket.addEventListener('open', (e) => {
      ws.socket.send(JSON.stringify({
        action: 'join-room',
        roomCode: roomCode
      }));
      ws.socket.addEventListener('message', (messageE) => {
        const req = JSON.parse(messageE.data);
        if (req.action === 'join-room') {
          if (req.status === 'success') {
            console.log('Joined room')
            this.setState({ connected: true });
          } else {
            console.error('Failed to join room.');
          }
        }
      })
    });
    ws.socket.addEventListener('close', (e) => {
      this.setState({ connected: false });
    });
  }


  render() {
    const { ws } = this.props;
    const { connected } = this.state;
    console.log(connected, ws);
    return (
      <div>
        <DesktopShortcuts />
        <OpenWindows ws={ws} />
        <Toolbar/>
      </div>
    )
  }
}

export default RoomMain;