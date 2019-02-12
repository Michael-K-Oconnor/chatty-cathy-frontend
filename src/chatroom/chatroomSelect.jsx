import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import ChatroomInput from './chatroomInput';

class ChatroomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
    this.socket = io('/chatrooms', {
      path: '/socket/messages/socket.io',
      reconnect: true
    });
    this.socket.on('newChatroomForClient', room => {
      const { rooms } = this.state;
      this.setState({
        rooms: rooms.concat([room])
      });
    });
  }

  componentDidMount = () => {
    this.getRooms();
  };

  getRooms = () => {
    axios.get(`${window.location.origin}/api/messages/chatrooms`).then(result => {
      this.setState({ rooms: result.data });
    });
  };

  submitRoom = roomname => {
    this.socket.emit('chatroomSubmitted', { roomname });
  };

  render() {
    const { rooms } = this.state;
    const { handleRoomSelect } = this.props;
    return (
      <div>
        <ChatroomInput submitRoom={this.submitRoom} />
        <select onChange={handleRoomSelect}>
          {rooms.map(room => (
            <option key={room.roomId} value={room.roomId}>
              {room.roomname}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default ChatroomSelect;

ChatroomSelect.propTypes = {
  handleRoomSelect: PropTypes.func
};
