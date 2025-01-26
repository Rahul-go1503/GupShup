import { Router } from 'express'
import { createUser, deleteUser, getAllContacts, getAllUsers, getUserInfo, searchContacts, updateUser } from '../controllers/userController.js'
import validateJWT from '../middlewares/validateJWT.js'
const route = Router()

route.post('/signup', createUser)

route.use(validateJWT)
route.get('/', getUserInfo)
route.get('/contacts', getAllContacts)
route.get('/all', getAllUsers)
route.delete('/delete', deleteUser)
route.post('/update', updateUser)
route.get('/search', searchContacts)


export default route