import { Router } from "express";
import validateJWT from "../middlewares/validateJWT.js";
import { createNewGroup, getGroupDetails } from "../controllers/groupController.js";
import { removeProfileImage, uploadProfileImage } from "../controllers/userController.js";

const route = Router()

route.use(validateJWT)
route.post('/', createNewGroup)
route.get('/:id', getGroupDetails)

route.put('/profile/:id', uploadProfileImage)
route.delete('/profile/:id', removeProfileImage)

export default route