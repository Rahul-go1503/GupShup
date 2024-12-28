import logEvents from "../utils/logEvents.js"

const errLogger = async (err,req,res,next)=>{
    const logFileName = 'errLog.txt'
    const log = `${err.name} : ${err.message}`
    await logEvents(log, logFileName)
    next()
}

export default errLogger