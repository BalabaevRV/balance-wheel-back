import { getWheelsByUserId } from '../wheel/wheel.service'
import { getRecordsByUserId } from '../record/record.service'
import { IUser } from './user.types'
import { IWheel } from '@/modules/wheel/wheel.types'
import { IRecord } from '@/modules/record/record.types'
import { findUserById, updateAvatarById, deleteAvatarById } from './user.model'
import { saveAvatar, deleteAvatar } from '@/shared/utils/avatarStorage'
import type { Express } from 'express'

export const getUserInfoById = async (id: number): Promise<IUser> => {
	const existingUser = await findUserById(id)
	if (!existingUser) {
		throw new Error('User not found')
	}
	try {
		const currentUserWheels: IWheel[] = await getWheelsByUserId(existingUser.user_id, 10)
		const currentUserRecords: IRecord[] = await getRecordsByUserId(existingUser.user_id, 10)
		return {
			user_id: existingUser.user_id,
			login: existingUser.login,
			avatar_url: existingUser.avatar_url,
			name: existingUser.name,
			email: existingUser.email,
			wheels: currentUserWheels,
			records: currentUserRecords
		}
	} catch (error) {
		console.error('❌ Error during login:', error)
		throw error
	}
}

export const updateAvatar = async (userId: number, file: Express.Multer.File) => {
	const avatarUrl = await saveAvatar(file)
	const userInfo = await updateAvatarById(userId, avatarUrl)
	return userInfo
}

export const deleteAvatarService = async (userId: number) => {
	const user = await findUserById(userId)
	if (user.avatar_url) {
		await deleteAvatar(user.avatar_url)
	}
	const userInfo = await deleteAvatarById(userId)
	return userInfo
	// Implementation for deleting avatar
}
