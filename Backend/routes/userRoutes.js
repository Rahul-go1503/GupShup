import { Router } from 'express'
import { deleteUser, getAllContacts, getAllUsers, getUserInfo, removeProfileImage, searchContacts, updateUserInfo, uploadProfileImage } from '../controllers/userController.js'
import validateJWT from '../middlewares/validateJWT.js'
const route = Router()


route.use(validateJWT)
route.get('/', getUserInfo)
route.put('/', updateUserInfo)
route.delete('/', deleteUser)

route.get('/contacts', getAllContacts)
route.get('/all', getAllUsers)
route.get('/search', searchContacts)

route.put('/profile/', uploadProfileImage)
route.delete('/profile/', removeProfileImage)


export default route