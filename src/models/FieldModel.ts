import { Field } from '@/types/index'
import { pool } from '@/config/DatabasePool'

export const createFieldsFromArrary = async (fields: Field[], wheelId?: number): Promise<Field[]> => {
   for (const field of fields) {
        const fieldId = await getExistFieldId(field)
        if (fieldId && typeof fieldId === 'number') {
            field.field_id = fieldId
        } else {
            const fieldResult = await pool.query(
                'INSERT INTO fields (name, color_hex) VALUES ($1, $2) RETURNING field_id, name, color_hex',
                [field.name, field.color_hex]
            );
            field.field_id = fieldResult.rows[0].field_id
        }
        if (wheelId) {
            await pool.query(
                'INSERT INTO wheels_fields (wheel_id, field_id) VALUES ($1, $2)',
                [wheelId, field.field_id]
            );
        }
    }      
    return fields   
}

const getExistFieldId = async (field: Field): Promise<boolean | number> => {
    const result = await pool.query(
        'SELECT field_id FROM fields WHERE name = $1 and color_hex = $2 LIMIT 1',
        [field.name, field.color_hex]
    );
    if (result.rowCount && result.rowCount > 0) {
        return result.rows[0].field_id
    }
    return false
}