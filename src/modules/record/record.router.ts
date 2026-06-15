import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { saveRecord, getRecordById, deleteRecord } from '@/modules/record/record.controller'

const express = require('express')
const router = express.Router()

router.use(authMiddleware)
router.use(authGuard)

router.post('/records', saveRecord)
router.get('/records/:id', getRecordById)
router.delete('/records/:id', deleteRecord)

export default router
