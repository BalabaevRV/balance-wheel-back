import { getUserInfo } from '@/controllers/UserController1'
import { authGuard, authMiddleware } from '@/middleware/AuthMiddleware'

const express = require('express')
const router = express.Router()

router.get('/user', authMiddleware, authGuard,  getUserInfo)
router.get('/user/:id', authMiddleware, authGuard, getUserInfo)

export default router