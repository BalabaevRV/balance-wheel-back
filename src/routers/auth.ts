import { loginUser, logoutUser, signupUser } from '@/controllers/authController'

const express = require('express')
const router = express.Router()

router.post('/api/login', loginUser)
router.post('/api/signup', signupUser)

export default router