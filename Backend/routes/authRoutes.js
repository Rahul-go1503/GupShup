import {Router} from 'express'
import { loginHandler, logoutHandler } from '../controllers/authController.js'
import validateJWT from '../middlewares/validateJWT.js'

const route = Router()

route.post('/login', loginHandler)
// Check: do we need to validate before logout?
route.get('/logout',logoutHandler)


export default route