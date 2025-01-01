import {Router} from 'express'
import { createUser, deleteUser, getAllUsers, getUserInfo, updateUser } from '../controllers/userController.js'
import validateJWT from '../middlewares/validateJWT.js'
const route = Router()

route.post('/signup', createUser)

// route.use(validateJWT)
route.get('/', validateJWT, getUserInfo)
route.get('/all', getAllUsers)
route.delete('/delete',validateJWT, deleteUser)
route.post('update', updateUser)


export default route