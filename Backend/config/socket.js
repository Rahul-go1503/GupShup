import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import Message from '../models/Message.js';
// Initialize Express App

const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})

const userSocketMap = new Map()

// Socket.io connection
io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId
  console.log(`Client with UserId : ${userId} and Socket Id : ${socket.id} connected`)
  userSocketMap.set(userId, socket.id)
  console.log(userSocketMap)
  // io.emit()

  socket.on('sendMessage', async (data) => {
    const { message, to } = data
    // console.log(message)
    const senderId = socket.handshake.query.userId
    const receiverId = userSocketMap.get(to)

    console.log(senderId, receiverId);
    const newMessage = new Message({
      senderId,
      receiverId: to,
      message: message
    })
    try {
      await newMessage.save()
      socket.emit('receiveMessage', newMessage)
      if (receiverId) socket.to(receiverId).emit('receiveMessage', newMessage)
      // i.to(receiverId).emit('receiveMessage', message)
    }
    catch (error) {
      console.log(error)
      // :TODO Handle Error
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(reason, `- Client with UserId : ${socket.userId} and Socket Id : ${socket.id} Disconnected`)
    // Check: if we can do this
    // userSocketMap.delete(socket.handshake.query.userId)

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId)
        break
      }
    }

  })
})

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
})

export { app, io, server }