import { pool } from '@/config/database'

export const getWheelsIdArrayByUser = async (userId: number, limit: number = 10) => {
    let query:string = `
        SELECT wheel_id
        FROM users_wheels
        WHERE user_id = $1
    `;
    const values = [userId];
    if (limit && limit > 0) {
        query += ` LIMIT $2`;
        values.push(limit);
    }
    
    const result = await pool.query(query, values);
    return result.rows.map(row => row.wheel_id);
}

export const getWheelsByIdArray = async (wheelIds: number[]) => {
     if (!wheelIds || wheelIds.length === 0) {
        return [];
    }
    
    const query = `
        SELECT *
        FROM wheels
        WHERE wheel_id = ANY($1)
    `;

    const values = [wheelIds];
    const result = await pool.query(query, values);
    return result.rows;
}

