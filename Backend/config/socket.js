import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { registerSocketHandlers } from '../controllers/socketController/registerSocketHandlers.js';
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
  console.log('connecting to socket...')
  const { _id: userId, firstName: userName } = socket.handshake.auth
  // const userName = socket.handshake.query.userNamed
  // join room to handle multi tab and multi device communication
  socket.join(userId)
  console.log(`Client(${userName}) with UserId : ${userId} and Socket Id : ${socket.id} connected`)
  userSocketMap.set(userId, socket.id)
  console.log(userSocketMap)

  registerSocketHandlers(io, socket)
  socket.on('disconnect', (reason) => {
    console.log(reason, `- Client(${userName}) with UserId : ${userId} and Socket Id : ${socket.id} Disconnected`)
    // Check: if we can do this
    // userSocketMap.delete()
    socket.leave(userId)
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId)
        break
      }
    }
    console.log(userSocketMap)
  })
})

io.engine.on("connection_error", (err) => {
  // console.log(err.req);      // the request object
  // console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  // console.log(err.context);  // some additional error context
})

export { app, io, server, userSocketMap }