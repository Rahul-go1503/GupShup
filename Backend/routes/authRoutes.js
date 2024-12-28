
import {Router} from 'express'
import { loginHandler, logoutHandler } from '../controllers/authController.js';
import { createUser } from '../controllers/userController.js';

const route = Router()


// signup
route.post('/signup', createUser)

//login
route.post('/login', loginHandler)

//logout

route.get('/logout',logoutHandler)

export default route