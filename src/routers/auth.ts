import { loginUser, logoutUser, signupUser } from '@/controllers/auth'

const express = require('express')
const router = express.Router()

router.post('/api/login', loginUser)
router.post('/api/logout', logoutUser)
router.post('/api/signup', signupUser)

export default router