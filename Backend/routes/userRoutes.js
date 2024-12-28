import {Router} from 'express'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js'
import validateJWT from '../middlewares/validateJWT.js'
const route = Router()

route.post('/signup', createUser)

route.use(validateJWT)
route.get('/', getAllUsers)
route.post('/delete', deleteUser)
route.post('update', updateUser)
route.get(':id', getUserById)


export default route