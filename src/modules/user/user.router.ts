import {
	getUserInfo,
	getWheelsByUser,
	getRecordsByUser,
	updateUserAvatar,
	deleteUserAvatar
} from '@/modules/user/user.controller'
import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { upload, handleMulterError } from '@/shared/middleware/upload'

const express = require('express')
const router = express.Router()

router.use(authMiddleware)
router.use(authGuard)

router.get('/user', getUserInfo)
router.get('/user/:id', getUserInfo)
router.get('/user/:id/wheels', getWheelsByUser)
router.get('/user/:id/records', getRecordsByUser)
router.post('/user/avatar', upload.single('avatar'), handleMulterError, updateUserAvatar)
router.delete('/user/avatar', deleteUserAvatar)

export default router
