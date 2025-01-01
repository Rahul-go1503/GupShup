// Import Dependencies
import { json } from 'express'
import {config} from 'dotenv'
import connectToDatabase from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import reqLogger from './middlewares/reqLogger.js'
import { app, server } from './config/socket.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.js'
import cors from 'cors'

//Load Environment Variables
config();

// Connect to the database
connectToDatabase();

//Set Up Middleware
app.use(json());
app.use(cookieParser())
app.use(reqLogger)

// Check: CORS 
const corsOptions = {
  origin : `${process.env.ORIGIN}`
}
// Define Routes
app.use('/api/auth',authRoutes)
app.use(cors(corsOptions))
app.use('/api/user', userRoutes)
app.use('/api/messages', messageRoutes)


// root route
app.get('/', (req, res) => {
  res.send('GupShup Chat Application Server is running!');
});


// 404 Route
app.all('*', (req, res) => {
  res.status(404).json({message : 'Resource not found'});
});

app.use(errorHandler)

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

// Global Error Handler
process.on('uncaughtException', (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1); // Exit the process to avoid unpredictable behavior
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});