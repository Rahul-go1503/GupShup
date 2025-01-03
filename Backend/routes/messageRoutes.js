import { Router } from "express"
import { getAllMessagesById } from "../controllers/messageController.js"
import validateJWT from "../middlewares/validateJWT.js"

const route = Router()

route.post('/all', validateJWT, getAllMessagesById)

export default route