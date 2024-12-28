import logEvents from "../utils/logEvents.js"

const reqLogger = async (req,res,next)=>{
    const logFileName = 'reqLog.txt'
    const log = `${req.url}\t${req.method}\t${req.header.origin}`
    await logEvents(log, logFileName)
    next()
}

export default reqLogger