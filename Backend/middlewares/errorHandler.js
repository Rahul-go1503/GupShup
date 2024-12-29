import logEvents from "../utils/logEvents.js";

// Centralized Error-Handling Middleware
const errorHandler = async (err) => {
    if(!err) return
    console.error("Error:", err.message || 'Internal Server Error');
    const logFileName = 'errLog.txt'
    const log = `${err.name} : ${err.message}`
    await logEvents(log, logFileName)
    // Todo: Custom Error Message
    res.status(err.status || 500).json({ message: 'Internal Server Error', error : err.message});
    // next()
}

export default errorHandler;