import { pool } from '@/config/database'
import { CreateWheelPayload } from '@/modules/wheel/wheel.types'
import { createFieldsFromArrary, updateFieldsWheelConnection, getFieldsByWheelId } from '@/modules/wheel/field.model'

export const getWheelsList = async () => {

}

export const getWheelFromDb = async (wheelId: number) => {
    try {
        console.log(333)
        const wheelResult = await pool.query(
            'SELECT wheel_id ,name, interval_seconds as "intervalSeconds" FROM wheels WHERE wheel_id = $1 LIMIT 1',
            [wheelId]
        );
        console.log(555)
        const fields = await getFieldsByWheelId(wheelId)
         console.log(6)
        return { data: { wheel: wheelResult.rows[0], fields}, success: true }
    } catch(error) {
        console.log(error)
        return error
     }
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
        await pool.query('COMMIT')
        return { data: { wheel, fields: fieldsWithId}, success: true }
     } catch(error) {
        console.log(error)
        return error
     }
}

export const deleteWheelFromDb = (createWheelPayload: CreateWheelPayload, userId: number) => {
    
}

export const editWheelById = async (createWheelPayload: CreateWheelPayload, userId: number) => {
    const { wheel, fields } = createWheelPayload
    try {
        await pool.query('BEGIN')
        const wheelResult = await pool.query(
            'UPDATE wheels SET name=$1, interval_seconds=$2 WHERE wheel_id=$3 RETURNING wheel_id, name, interval_seconds as "intervalSeconds"',
            [wheel.name, wheel.intervalSeconds, wheel.wheel_id]
        );
        const newFields = await updateFieldsWheelConnection(fields, Number(wheel.wheel_id))
        await pool.query('COMMIT')
        return { data: { wheel: wheelResult.rows[0], fields: newFields}, success: true }
    } catch(error) {
        console.log(error)
        return error
    }
}

const createUseWheelConnection = async (userId: number, wheelId: number) => {
    await pool.query(
        'INSERT INTO users_wheels (user_id, wheel_id) VALUES ($1, $2)',
        [userId, wheelId]
    );
}