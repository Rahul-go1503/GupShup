import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid';
import {format} from 'date-fns'

// to resolve __dirname undefined error
const __dirname = path.resolve()


const logEvents =  async (log, logFileName) => {
    try{
        if(!fs.existsSync(path.join(__dirname, 'logs'))) fs.mkdirSync(path.join(__dirname, 'logs'))
        const date = new Date()
        const logdata = `${format(date, 'yyyy-MM-dd HH:mm:ss')}\t${uuid()}\t${log}\n`
        await fsPromises.appendFile(path.join(__dirname, 'logs', logFileName), logdata)
    }
    catch(err){
        console.error(err.message)
    }
}


export default logEvents