import { pool } from '@/config/database'

export const getRecordsIdArrayByUser = async (userId: number, limit: number = 10) => {
    let query:string = `
        SELECT record_id
        FROM records
        WHERE user_id = $1
    `;
    const values = [userId];
    if (limit && limit > 0) {
        query += ` LIMIT $2`;
        values.push(limit);
    }
    
    const result = await pool.query(query, values);
    return result.rows.map(row => row.record_id);
}

export const getRecordsByIdArray = async (recordIds: number[]) => {
    if (!recordIds || recordIds.length === 0) {
        return [];
    }
    
    const query = `
        SELECT 
            r.record_id,
            r.wheel_id,
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
    `;
    
    const values = [recordIds];
    const result = await pool.query(query, values);
    return result.rows;
}
