import { pool } from '@/config/database'
import { IWheel, IWheelSave } from './wheel.types';
import { PoolClient } from 'pg';

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
        w.wheel_id,
        w.name,
        w.interval_seconds,
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


export const getWheels = async () => {    
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
    GROUP BY w.wheel_id
    `;
    const result = await pool.query(query);
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

const updateMainWheelData = async (wheelId: number, wheelData: IWheelSave, client?: PoolClient) => {
    const db = client || pool;
    const updateWheelQuery = `
        UPDATE wheels 
        SET name = $1,
            interval_seconds = COALESCE($2, interval_seconds),
            updated_at = NOW()
        WHERE wheel_id = $3
        RETURNING *
    `;

    const wheelResult = await db.query(updateWheelQuery, [
        wheelData.name,
        wheelData.interval_seconds,
        wheelId
    ]);

    return wheelResult.rows[0];
}

const getCurrentFieldsIdForWheel = async (wheelId: number) => {
    const existingFieldsResult = await pool.query(
        'SELECT field_id FROM wheels_fields WHERE wheel_id = $1',
        [wheelId]
    );
    return existingFieldsResult.rows.map(row => row.field_id);
}

const getExistingFieldId = async (name: string, color_hex: string) => {
    const existingField = await pool.query(
        `SELECT field_id FROM fields 
        WHERE name = $1 AND color_hex = $2`,
        [name, color_hex]
    );
    return existingField.rows.length > 0 ? existingField.rows[0].field_id : null;
}

const createNewField = async (name: string, color_hex: string, client?: PoolClient) => {
    const db = client || pool;
    const newFieldResult = await db.query(
        `INSERT INTO fields (name, color_hex)
            VALUES ($1, $2)
            RETURNING field_id`,
        [name, color_hex]
    );
    return newFieldResult.rows[0].field_id;
}

const checkWheelFieldLinkExists = async (wheelId: number, fieldId: number) => {
    const existingLink = await pool.query(
        'SELECT 1 FROM wheels_fields WHERE wheel_id = $1 AND field_id = $2',
        [wheelId, fieldId]
    );  
    return existingLink.rows.length > 0;
}

const createWheelFieldLink = async (wheelId: number, fieldId: number, client?: PoolClient) => {
    const db = client || pool;
    await db.query(
        'INSERT INTO wheels_fields (wheel_id, field_id) VALUES ($1, $2)',
        [wheelId, fieldId]
    );
}

const deleteWheelFieldLInk = async (wheelId: number, fieldId: number, client?: PoolClient) => {
    const db = client || pool;
    await db.query(
        'DELETE FROM wheels_fields WHERE wheel_id = $1 AND field_id = $2',
        [wheelId, fieldId]
    );
}


export const updateWheel = async (wheelId: number, wheelData: IWheelSave):Promise<IWheel> => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        const updatedWheel = await updateMainWheelData(wheelId, wheelData, client);

        if (!updatedWheel) {
            throw new Error('Wheel not found');
        }

        const currentFieldIds = await getCurrentFieldsIdForWheel(wheelId);
        const newFieldIds: number[] = [];

        for (const field of wheelData.fields) {
            const fieldId = await getExistingFieldId(field.name, field.color_hex) || await createNewField(field.name, field.color_hex, client);
            newFieldIds.push(fieldId);
            const linkExists = await checkWheelFieldLinkExists(wheelId, fieldId);
            if (!linkExists) {
                await createWheelFieldLink(wheelId, fieldId, client);
            }      
        }

       const fieldsToRemove = currentFieldIds.filter(id => !newFieldIds.includes(id));
        for (const fieldIdToRemove of fieldsToRemove) {
             await deleteWheelFieldLInk(wheelId, fieldIdToRemove, client);
        }
        await client.query('COMMIT');
        const wheel:IWheel[] = await getWheelsByIdArray([wheelId]);
        return wheel[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating wheel:', error);
        throw error;
    }
}

export const createWheel = async (wheelData: IWheelSave, userId: number):Promise<IWheel> => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        const queryWheel = `
            INSERT INTO wheels (name, interval_seconds, owner_id, created_at, updated_at) 
            VALUES ($1, $2, $3, NOW(), NOW())
            RETURNING wheel_id, name, interval_seconds
        `
        const valuesWheel = [wheelData.name, wheelData.interval_seconds, userId]
        const wheelResult = await client.query(queryWheel, valuesWheel)
        
        const wheelId = wheelResult.rows[0].wheel_id
        addWheelToUser(userId, wheelResult.rows[0].wheel_id, client)

        for (const field of wheelData.fields) {
            const fieldId = await getExistingFieldId(field.name, field.color_hex) || await createNewField(field.name, field.color_hex)
            await createWheelFieldLink(wheelId, fieldId, client)    
        }
        await client.query('COMMIT');
        const wheel:IWheel[] = await getWheelsByIdArray([wheelId]);
        return wheel[0];

     } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error create wheel:', error);
        throw error;
    }
}

export const addWheelToUser = async (userId: number, wheelId: number, client?: PoolClient) => {       
    const db = client || pool;
    const query = `
                INSERT INTO users_wheels (user_id, wheel_id) 
                VALUES ($1, $2)
            `
    const values = [userId, wheelId]
    await db.query(query, values)
}