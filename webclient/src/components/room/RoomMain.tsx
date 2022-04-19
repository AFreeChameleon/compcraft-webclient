import React from 'react';
import DesktopShortcuts from './DesktopShortcuts';
import OpenWindows from './OpenWindows';
import Toolbar from './Toolbar';

type RoomMainProps = {
  roomCode: string;
  ws: WebSocket;
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
    ws.addEventListener('open', (e) => {
      ws.send(JSON.stringify({
        action: 'join-room',
        roomCode: roomCode
      }));
      ws.addEventListener('message', (messageE) => {
        const res = JSON.parse(messageE.data);
        if (res.action === 'join-room' && res.status === 'success') {
          console.log('Joined room')
          this.setState({ connected: true });
        } else {
          console.error('Failed to join room')
        }
      })
    });
    ws.addEventListener('close', (e) => {
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
        <OpenWindows />
        <Toolbar/>
      </div>
    )
  }
}

export default RoomMain;