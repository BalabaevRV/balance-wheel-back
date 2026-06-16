import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import type { Express } from 'express'

const AVATARS_DIR = path.join(__dirname, '../../../uploads/avatars')

export const saveAvatar = async (file: Express.Multer.File): Promise<string> => {
	const filename = `${uuidv4()}.webp`
	const filepath = path.join(AVATARS_DIR, filename)

	await sharp(file.path)
		.resize(200, 200, {
			fit: 'cover',
			position: 'centre'
		})
		.webp({ quality: 80 })
		.toFile(filepath)

	if (file.path !== filepath) {
		await fs.unlink(file.path).catch(() => {})
	}

	return `/uploads/avatars/${filename}`
}

export const deleteAvatar = async (avatarUrl: string): Promise<void> => {
	if (!avatarUrl) return

	const filename = avatarUrl.split('/').pop()
	if (!filename) return

	const filepath = path.join(AVATARS_DIR, filename)
	await fs.unlink(filepath).catch(() => {})
}

export const getAvatarPath = (avatarUrl: string): string => {
	return path.join(AVATARS_DIR, avatarUrl.split('/').pop() || '')
}
