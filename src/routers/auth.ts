const express = require('express')

const router = express.Router()
import { loginUser, logoutUser, signupUser } from '@/controllers/auth'

router.post('/api/login', loginUser)
router.post('/api/logout', logoutUser)
router.post('/api/signup', signupUser)

export default router