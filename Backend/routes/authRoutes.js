import {Router} from 'express'
import { loginHandler, logoutHandler } from '../controllers/authController.js'
import validateJWT from '../middlewares/validateJWT.js'

const route = Router()

route.post('/login', loginHandler)
route.get('/logout',validateJWT,logoutHandler)


export default route