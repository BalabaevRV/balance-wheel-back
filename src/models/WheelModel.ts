import { pool } from '@/config/DatabasePool'
import { CreateWheelPayload } from '@/types/index'
import { createFieldsFromArrary } from '@/models/FieldModel'

export const getWheelsList = () => {

}

export const getWheelFromDb = () => {

}

export const createWheelInDb = async (createWheelPayload: CreateWheelPayload, userId: number) => {
    const { wheel, fields } = createWheelPayload
     try {
        await pool.query('BEGIN')
        const wheelResult = await pool.query(
            'INSERT INTO wheels (name, interval_seconds) VALUES ($1, $2) RETURNING wheel_id, name, interval_seconds',
            [wheel.name, wheel.intervalSeconds]
        );
        wheel.wheel_id = wheelResult.rows[0].wheel_id;
        const fieldsWithId = await createFieldsFromArrary(fields, wheel.wheel_id)
        if (wheel.wheel_id) await createUseWheelConnection(userId, wheel.wheel_id)
        await pool.query('COMMIT');
        return { data: { wheel, fields: fieldsWithId}, success: true }
     } catch(error) {
        console.log(error)
        return error
     }
}

export const deleteWheelFromDb = () => {
    
}

export const editWheelById = () => {
    
}

const createUseWheelConnection = async (userId: number, wheelId: number) => {
    await pool.query(
        'INSERT INTO users_wheels (user_id, wheel_id) VALUES ($1, $2)',
        [userId, wheelId]
    );
}