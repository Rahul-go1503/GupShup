// Import Dependencies
import express, { json } from 'express';
import {config} from 'dotenv'
//import Users from './Schemas/Users';
import connectToDatabase from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import {createServer} from 'node:http'
import { Server } from 'socket.io';
import reqLogger from './middlewares/reqlogger.js';
import errLogger from './middlewares/errLogger.js';

//Load Environment Variables
config();

// Connect to the database
connectToDatabase();

// Initialize Express App
const app = express();
const server = createServer(app)
const io = new Server(server,
  {cors : {
    origin : ['http://localhost:5173']
  }
  }
);

//Set Up Middleware
app.use(json());
app.use(reqLogger)
app.use(errLogger)

// Define Routes
app.use('/api/auth',authRoutes)


// root route
app.get('/', (req, res) => {
  res.send('GupShup Chat Application Server is running!');
});


// Socket.io connection
io.on('connection', async (socket) => {
  console.log(`Client with Socket Id : ${socket.id} connected`);
  socket.on('sendMessage',(message)=>{
    console.log(message)
    io.emit('receiveMessage',message)
  })
  socket.on('disconnect',(reason)=>{
    console.log(reason, `- Client with Socket Id : ${socket.id} Disconnected`)
  })
});

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});


// 404 Route
app.all('*', (req, res) => {
  res.status(404).send('Resource not found');
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
