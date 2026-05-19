import { getUserInfo, getWheelsByUser, getRecordsByUser } from '@/modules/user/user.controller'
import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'

const express = require('express')
const router = express.Router()

router.use(authMiddleware);
router.use(authGuard);

router.get('/user', getUserInfo)
router.get('/user/:id', getUserInfo)
router.get('/user/:id/wheels', getWheelsByUser)
router.get('/user/:id/records', getRecordsByUser)

export default router