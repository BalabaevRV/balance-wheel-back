import multer, { MulterError } from 'multer'
import path from 'path'
const { v4: uuidv4 } = require('uuid')
import type { Request, Response, NextFunction, Express } from 'express'
import fs from 'fs'
import { errorResponse } from '@/shared/utils/response'
import { config } from '@/config/env'

const avatarsDir = path.join(__dirname, '../../../uploads/avatars')
if (!fs.existsSync(avatarsDir)) {
	fs.mkdirSync(avatarsDir, { recursive: true })
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, avatarsDir)
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		const filename = `${uuidv4()}${ext}`
		cb(null, filename)
	}
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF allowed'), false)
	}
}

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: config.maxAvatarSize * 1024 * 1024 }
})

export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof MulterError) {
		const message = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 5MB)' : err.message
		return errorResponse(res, message, 400)
	}

	if (err) {
		return errorResponse(res, err.message, 400)
	}

	next()
}
