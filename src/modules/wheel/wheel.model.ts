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
  SELECT 
      w.*,
      COALESCE(
          json_agg(
              json_build_object(
                  'field_id', f.field_id,
                  'name', f.name,
                  'color_hex', f.color_hex
              )
          ) FILTER (WHERE f.field_id IS NOT NULL),
          '[]'::json
      ) as fields
  FROM wheels w
  LEFT JOIN wheels_fields wf ON w.wheel_id = wf.wheel_id
  LEFT JOIN fields f ON wf.field_id = f.field_id
  WHERE w.wheel_id = ANY($1)
  GROUP BY w.wheel_id
`;
    const values = [wheelIds];
    const result = await pool.query(query, values);
    console.log(result)
    return result.rows;
}




export const editWheelById = async (wheelIds: number[], d: number) => {
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


export const deleteWheelFromDb = async (wheelIds: number[]) => {
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


export const createWheelInDb = async (wheelIds: number[], d: number) => {
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


export const getWheelFromDb = async (wheelIds: number) => {
     if (!wheelIds) {
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


