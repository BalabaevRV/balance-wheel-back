import { loginUser, signupUser } from '@/modules/user/auth.controller'

const express = require('express')
const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signupUser)

export default router