import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSideBar';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    // socket.on("disconnect", (reason) => {
    //   // the reason of the disconnection, for example "transport error"
    //   console.log(reason);
    // })

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', message); // Send message to backend
    // setMessages((prev) => [...prev, message]);
    setMessage('');
  };
  const navigate = useNavigate()
  const logoutHandler = async () => {
    try{
      await axios.get('/api/auth/logout', {withCredentials : true});
      // localStorage.removeItem('auth')
      socket.disconnect()
      navigate('/')
    }
    catch(err){
      console.error(err)
    }
  }
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    <div className='container h-full'>
      {/* <SidebarTrigger /> */}
      <button className='m-2 w-auto' onClick={logoutHandler}>Log out</button>
      <h2>Lets Go 🔥</h2>
      {/* Display messages */}
      {/* <hr/> */}
      <div className='containter flex'>
        <div id='users' className=''>

        </div>
        <div id='chat' className='p-2 relative'>
          <div className='border-2 p-2'>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <div className='fixed bottom-0'>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className='m-2'
              />
            <button onClick={sendMessage}>Send</button>
          </div>
        {/* <hr/> */}
        </div>
      </div>
    </div>
    // </SidebarProvider>
  );
};

export default Chat;