import express from 'express'
import {createServer} from 'node:http'
import { Server } from 'socket.io'
import Message from '../models/Message.js';
// Initialize Express App

const app = express();
const server = createServer(app)
const io = new Server(server,
  {cors : {
    origin : ['http://localhost:5173']
  }
  }
)

const userSocketMap = new Map()

// Socket.io connection
io.on('connection', async (socket) => {
  console.log(`Client with UserId : ${socket.userId} and Socket Id : ${socket.id} connected`)
  userSocketMap.set(socket.userId,socket.id)


  socket.on('sendMessage', async (to, message)=>{
    console.log(message)
    const senderId = socket.userId
    const receiverId = userSocketMap.get(to)

    const newMessage = new Message({
      senderId,
      receiverId,
      message : message
    })
    try{
      await newMessage.save()
      socket.to(receiverId).emit('receiveMessage',message)
    }
    catch(error){
      console.log(error)
      // :TODO Handle Error
    }
  })

  socket.on('disconnect',(reason)=>{
    console.log(reason, `- Client with UserId : ${socket.userId} and Socket Id : ${socket.id} Disconnected`)
  })
})

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
})

export {app,io,server}