import { getWheelsIdArrayByUser, getWheelsByIdArray } from '@/modules/wheel/wheel.model'
import { IWheel } from './wheel.types'

export const getWheelsByUserId = async (userId: number, limit: number = 10):Promise<IWheel[]> => {
  const wheelsId:number[] = await getWheelsIdArrayByUser(userId, limit);
  const wheels:IWheel[] = await getWheelsByIdArray(wheelsId);
  return wheels;
}


