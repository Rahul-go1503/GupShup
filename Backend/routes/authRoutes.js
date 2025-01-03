import { Router } from 'express'
import { checkAuthHandler, loginHandler, logoutHandler } from '../controllers/authController.js'
import validateJWT from '../middlewares/validateJWT.js'

const route = Router()

route.post('/login', loginHandler)
// Check: do we need to validate before logout?
route.get('/logout', logoutHandler)
route.get('/checkAuth', validateJWT, checkAuthHandler)


export default route