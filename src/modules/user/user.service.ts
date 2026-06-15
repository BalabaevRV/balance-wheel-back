import { getWheelsByUserId } from '../wheel/wheel.service'
import { getRecordsByUserId } from '../record/record.service'
import { IUser } from './user.types'
import { IWheel } from '@/modules/wheel/wheel.types'
import { IRecord } from '@/modules/record/record.types'
import { findUserById } from './user.model'

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
