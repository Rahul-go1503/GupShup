import { Router } from 'express'
import { checkAuthHandler, forgotPasswordHandler, loginHandler, logoutHandler, resendVerificationLinkHandler, resetPasswordHandler, signupHandler, verifyEmailHandler } from '../controllers/authController.js'
import validateJWT from '../middlewares/validateJWT.js'

const route = Router()

route.post('/signup', signupHandler)
route.get('/verify-email', verifyEmailHandler)
route.post("/resend-verification", resendVerificationLinkHandler)
route.post('/forgot-password', forgotPasswordHandler)
route.post('/reset-password', resetPasswordHandler)

route.post('/login', loginHandler)
// Check: do we need to validate before logout?
route.get('/logout', logoutHandler)
route.get('/checkAuth', validateJWT, checkAuthHandler)


export default route