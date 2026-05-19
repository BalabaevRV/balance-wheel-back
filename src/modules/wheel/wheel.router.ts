import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { getWheels, getWheelById, saveWheel, attachWheel, detachWheel } from '@/modules/wheel/wheel.controller'

const express = require('express')
const router = express.Router()

router.use(authMiddleware);
router.use(authGuard);

router.get('/wheels', getWheels)
router.get('/wheels/:id', getWheelById)
router.post('/wheels', saveWheel)
router.post('/wheels/:wheelId/attach', attachWheel)
router.post('/wheels/:wheelId/detach', detachWheel)

export default router