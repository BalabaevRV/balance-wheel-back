import { getRecordsByIdArray, getRecordsIdArrayByUser } from "./record.model";
import { IRecord } from "./record.types";

export const getRecordsByUserId = async (userId: number, limit: number = 10):Promise<IRecord[]> => {
  const recordsId:number[] = await getRecordsIdArrayByUser(userId, limit);
  const records:IRecord[] = await getRecordsByIdArray(recordsId);
  return records;
}
