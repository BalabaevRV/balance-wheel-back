import { getWheelsIdArrayByUser, getWheelsByIdArray, getWheels, updateWheel, createWheel } from '@/modules/wheel/wheel.model'
import { IWheel, IWheelSave } from './wheel.types'
import { ApiResponse } from '@/shared/types/api.types'

export const getWheelsByUserId = async (userId: number, limit: number = 10):Promise<IWheel[]> => {
  const wheelsId:number[] = await getWheelsIdArrayByUser(userId, limit);
  const wheels:IWheel[] = await getWheelsByIdArray(wheelsId);
  return wheels;
}

export const getWheelsList = async ():Promise<ApiResponse<IWheel[]>> => {
  try {
  const wheels:IWheel[] = await getWheels();
    return { 
            message: 'User created successfully',
            success: true,
            data: wheels
        }
    } catch (error) {
        console.error('❌ Error during get wheels list:', error);
        throw error;
    }
}

export const getWheelInfo = async (wheelId: number):Promise<ApiResponse<IWheel>> => {
    try {
      const wheel:IWheel[] = await getWheelsByIdArray([wheelId]);
        return { 
                message: 'Wheel info got successfully',
                success: true,
                data: wheel[0]
        }
    } catch (error) {
        console.error('❌ Error during get wheel info:', error);
        throw error;
    }
}

export const saveWheelInfo = async (wheelData: IWheelSave, userId: number):Promise<ApiResponse<IWheel>> => {
  try {
    let wheel: IWheel;
    if (wheelData.wheel_id) {
      wheel = await updateWheel(wheelData.wheel_id, wheelData);
    } else {
      wheel = await createWheel(wheelData, userId);
    }
  return { 
            message: 'Wheel info updated successfully',
            success: true,
            data: wheel
    }
    } catch (error) {
        console.error('❌ Error during save wheels:', error);
        throw error;
    }
}