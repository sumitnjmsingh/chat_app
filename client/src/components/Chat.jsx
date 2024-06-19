import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';

const ENDPOINT = 'http://localhost:5000';

let socket;

const Chat = ({ history }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('General');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/');
    } else {
      const decoded = jwtDecode(token);
      setName(decoded.username);

      socket = io(ENDPOINT, { query: { token } });

      socket.emit('join',{  name: decoded.username, room} );

      socket.on('message', (message) => {
        setMessages((messages) => [...messages, message]);
        setMessage("")
        console.log(message)
      });

      socket.emit("sendMessage",message);

      return () => {
        socket.disconnect()
        socket.off();
      };
    }
  }, [history, room]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-slate-700 font-serif'>
        <div className='h-[60%] lg:w-[40%] w-[75%] bg-neutral-400 flex flex-col p-3 shadow-2xl gap-2' >
      <h1 className='flex justify-center items-center text-3xl h-[10%]'>Chat Room</h1>
      <div className='flex flex-col  h-[78%] overflow-auto bg-white p-2 '>
        {messages.map((message, index) => (
          <div key={index}><strong>{message.user}</strong>: {message.text}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='flex  h-[10%] w-[100%]'>
        <div className='flex border-solid border-black border-[2px] w-[100%]'>
        <input className=' p-1 bg-neutral-300 outline-none w-[80%]' type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." required />
        <button className='w-[20%]' type="submit">Send</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Chat;
