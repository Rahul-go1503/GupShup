import { Router } from "express"
import { getAllMessagesById, uploadFile } from "../controllers/messageController.js"
import validateJWT from "../middlewares/validateJWT.js"

const route = Router()

route.use(validateJWT)
route.post('/', uploadFile)
route.post('/all', getAllMessagesById)

export default route