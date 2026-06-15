import { pool } from '@/config/database'
import { IFieldValue, IRecord, IRecordSave } from './record.types'
import { PoolClient } from 'pg'

export const getRecordsIdArrayByUser = async (userId: number, limit?: number) => {
	let query: string = `
        SELECT record_id
        FROM records
        WHERE user_id = $1
    `
	const values = [userId]
	if (limit && limit > 0) {
		query += ` LIMIT $2`
		values.push(limit)
	}

	const result = await pool.query(query, values)
	return result.rows.map((row) => row.record_id)
}

export const getRecordsByIdArray = async (recordIds: number[]): Promise<IRecord[]> => {
	if (!recordIds || recordIds.length === 0) {
		return []
	}

	const query = `
        SELECT 
            r.record_id,
            r.wheel_id,
            r.user_id,
            w.name as balance_wheel_name,
            r.created_at,
            r.updated_at,
            r.date,
            COALESCE(
                json_agg(
                    json_build_object(
                        'field_id', f.field_id,
                        'name', f.name,
                        'color_hex', f.color_hex,
                        'value', rv.value
                    )
                ) FILTER (WHERE f.field_id IS NOT NULL),
                '[]'::json
            ) as values
        FROM records r
        LEFT JOIN wheels w ON r.wheel_id = w.wheel_id
        LEFT JOIN record_values rv ON r.record_id = rv.record_id
        LEFT JOIN fields f ON rv.field_id = f.field_id
        WHERE r.record_id = ANY($1)
        GROUP BY r.record_id, w.name
        ORDER BY r.date DESC
    `

	const values = [recordIds]
	const result = await pool.query(query, values)
	return result.rows
}

export const createRecord = async (recordData: IRecordSave, userId: number): Promise<number> => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		const query = `
            INSERT INTO records (user_id, wheel_id, date)
            VALUES ($1, $2, COALESCE($3, NOW()))
            RETURNING record_id, user_id, wheel_id, date
        `

		const valuesQuery = [userId, recordData.wheel_id, recordData.date]
		const result = await pool.query(query, valuesQuery)
		const record = result.rows[0]
		const valuesRecord = await insertRecordValues(record.record_id, recordData.values, client)
		record.values = valuesRecord
		await client.query('COMMIT')
		return record.record_id
	} catch (error) {
		await client.query('ROLLBACK')
		console.error('Error create record:', error)
		throw error
	} finally {
		client.release()
	}
}

export const updateRecord = async (recordData: IRecordSave, userId: number): Promise<number> => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		const query = `
            UPDATE records
            SET wheel_id = $1, date = COALESCE($2, NOW())
            WHERE record_id = $3 AND user_id = $4
            RETURNING record_id, user_id, wheel_id, date
        `
		const valuesQuery = [recordData.wheel_id, recordData.date, recordData.record_id, userId]
		const result = await client.query(query, valuesQuery)
		const record = result.rows[0]
		const valuesRecord = await updateRecordValues(record.record_id, recordData.values, client)
		record.values = valuesRecord
		await client.query('COMMIT')
		return record.record_id
	} catch (error) {
		await client.query('ROLLBACK')
		console.error('Error updating record:', error)
		throw error
	} finally {
		client.release()
	}
}

export const insertRecordValues = async (
	recordId: number,
	values: IFieldValue[],
	client?: PoolClient
): Promise<IFieldValue[]> => {
	const db = client || pool
	const valuesQuery: Number[] = []
	const placeholders: string[] = []
	values.forEach((recordValue, index) => {
		if (recordValue.field_id) {
			const baseIndex = index * 3
			placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`)
			valuesQuery.push(recordId, recordValue.field_id, recordValue.value)
		}
	})
	const query = `
        INSERT INTO record_values (record_id, field_id, value)
        VALUES ${placeholders.join(', ')}
        RETURNING field_id, value
    `
	const result = await db.query(query, valuesQuery)
	return result.rows
}

export const updateRecordValues = async (recordId: number, values: IFieldValue[], client?: PoolClient) => {
	await deleteRecordValues(recordId, client)
	return insertRecordValues(recordId, values, client)
}

export const deleteRecordValues = async (recordId: number, client?: PoolClient) => {
	const db = client || pool
	await db.query(`DELETE FROM record_values WHERE record_id = $1`, [recordId])
}

export const deleteRecordById = async (recordId: number) => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		await deleteRecordValues(recordId, client)
		await client.query(`DELETE FROM records WHERE record_id = $1`, [recordId])
		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		console.error('Error delete record:', error)
		throw error
	} finally {
		client.release()
	}
}
