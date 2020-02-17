import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import v1 from 'uuid';


class App extends Component {

  state = {
    username: "",
    textarea: "",
    messages: [],
    socket: null,
  }

  handleOutput = (data) => {

    if (data.length) {
      for (let x = 0; x < data.length; x++) {
        this.state.messages.push({
          name: data[x].name,
          text: data[x].message,
          id: data[x]._id ? data[x]._id : v1(),
          time: data[x].time,
        });
        this.setState(this.state.messages);
      }

      let messageBox = document.getElementById('messages');
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  }

  handleCleared = () => {
    this.setState({ messages: [] });
  }

  handleEmit = (e) => {
    if (e.which === 13 && e.shiftKey === false) {
      this.handleEmit_button();

      e.preventDefault();
    }
  }

  handleEmit_button = () => {
    const socket = this.state.socket;
    socket.emit('input', {
      name: this.state.username,
      message: this.state.textarea,
    });
  }

  handleClear_button = () => {
    const socket = this.state.socket;
    socket.emit('clear');
  }

  handleChange = (e) => {
    const target = e.target;
    this.setState({ [target.id]: target.value });
  }

  UNSAFE_componentWillMount() {
    const socket = io('https://mongo-chat-server.herokuapp.com/');
    if (socket !== "undefined") {
      console.log('connected to socket');
      this.setState({ socket });

      socket.on("output", this.handleOutput)
      socket.on("cleared", this.handleCleared)
    }
  }

  render() {

    const username = this.state.username;
    const textarea = this.state.textarea;
    const messages = this.state.messages;

    return (

      <div className="outfit row" >
        <div className="col s3 chat-title">
          <h6 className="text-center">
            My React Socket Chat App

        </h6>
          <div id="status"></div>
          <div id="chat" className="name-input">
            <input type="text" id="username" placeholder="Enter name..." onChange={this.handleChange} value={username} />
          </div>
          <div id="messages" className="message-box">
            {
              messages && messages.map(msg => (
                <div className="msg" key={msg.id}>{"[" + msg.time + "]  " + msg.name + ": " + msg.text}</div>
              ))
            }
          </div >

          <textarea id="textarea" className="materialize-textarea" data-length="120" onKeyDown={this.handleEmit} value={textarea} onChange={this.handleChange}></textarea>

        </div>
        <button id="send" className="btn send-button" onClick={this.handleEmit_button}>Send(enter)</button>
        <button id="send" className="btn clear-button" onClick={this.handleClear_button}>Clear</button>
      </div>
    );
  }
}

export default App;
