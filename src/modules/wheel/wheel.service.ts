import {
	getWheelsIdArrayByUser,
	getWheelsByIdArray,
	updateWheel,
	createWheel,
	addWheelToUser,
	removeWheelFromUser
} from '@/modules/wheel/wheel.model'
import { IWheel, IWheelSave } from './wheel.types'
import { IUser } from '@/modules/user/user.types'
import { getUserInfoById } from '@/modules/user/user.service'

export const getWheelsByUserId = async (userId: number, limit?: number): Promise<IWheel[]> => {
	try {
		const wheelsId: number[] = await getWheelsIdArrayByUser(userId, limit)
		const wheels: IWheel[] = await getWheelsByIdArray(wheelsId)
		return wheels
	} catch (error) {
		console.error('❌ Error during get wheels by user id:', error)
		throw error
	}
}

export const saveWheelInfo = async (wheelData: IWheelSave, userId: number): Promise<IWheel> => {
	try {
		let wheel: IWheel
		if (wheelData.wheel_id) {
			wheel = await updateWheel(wheelData.wheel_id, wheelData)
		} else {
			wheel = await createWheel(wheelData, userId)
		}
		return wheel
	} catch (error) {
		console.error('❌ Error during save wheels:', error)
		throw error
	}
}

export const attachWheelToUser = async (wheelId: number, userId: number): Promise<IUser> => {
	try {
		await addWheelToUser(userId, wheelId)
		const userInfo = await getUserInfoById(userId)
		return userInfo
	} catch (error) {
		console.error('❌ Error during get wheel info:', error)
		throw error
	}
}

export const detachWheelFromUser = async (wheelId: number, userId: number): Promise<IUser> => {
	try {
		await removeWheelFromUser(userId, wheelId)
		const userInfo = await getUserInfoById(userId)
		return userInfo
	} catch (error) {
		console.error('❌ Error during get wheel info:', error)
		throw error
	}
}
