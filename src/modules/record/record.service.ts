import { getRecordsByIdArray, getRecordsIdArrayByUser, updateRecord, createRecord } from './record.model'
import { IRecord, IRecordSave } from './record.types'

export const getRecordsByUserId = async (userId: number, limit?: number): Promise<IRecord[]> => {
	const recordsId: number[] = await getRecordsIdArrayByUser(userId, limit)
	const records: IRecord[] = await getRecordsByIdArray(recordsId)
	return records
}

export const saveRecordInfo = async (recordData: IRecordSave, userId: number): Promise<IRecord> => {
	try {
		let recordId: number
		if (recordData.record_id) {
			recordId = await updateRecord(recordData, userId)
		} else {
			recordId = await createRecord(recordData, userId)
		}
		return await getRecordsByIdArray([recordId]).then((records) => records[0])
	} catch (error) {
		console.error('❌ Error during save recor:', error)
		throw error
	}
}
