import { IField } from '@/modules/wheel/field.types'
import { pool } from '@/config/database'

export const createFieldsFromArrary = async (fields: IField[], wheelId?: number): Promise<IField[]> => {
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

export const updateFieldsWheelConnection = async (fields: IField[], wheelId: number): Promise<IField[]> => {
    const currentFieldsResult = await pool.query(
        'SELECT field_id FROM wheels_fields WHERE wheel_id = $1',
        [wheelId]
    );
    const currentFieldIds = currentFieldsResult.rows.map(row => row.field_id);
    const newFieldIds: number[] = [];

    for (const field of fields) {
        console.log(111)
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
        if (typeof field.field_id === 'number') newFieldIds.push(field.field_id)
        const exists = currentFieldIds.includes(field.field_id)
        if (!exists) {
            await pool.query(
                'INSERT INTO wheels_fields (wheel_id, field_id) VALUES ($1, $2)',
                [wheelId, fieldId]
            );
        }
    }
    const toDelete = currentFieldIds.filter(id => !newFieldIds.includes(id));
    if (toDelete.length > 0) {
        await pool.query(
            'DELETE FROM wheels_fields WHERE wheel_id = $1 AND field_id = ANY($2::int[])',
            [wheelId, toDelete]
        );
    }
    return fields
}

const getExistFieldId = async (field: IField): Promise<boolean | number> => {
    const result = await pool.query(
        'SELECT field_id FROM fields WHERE name = $1 and color_hex = $2 LIMIT 1',
        [field.name, field.color_hex]
    );
    if (result.rowCount && result.rowCount > 0) {
        return result.rows[0].field_id
    }
    return false
}

export const getFieldsByWheelId = async (wheelId: number) => {
    const fieldsResult = await pool.query(`
        SELECT 
            f.field_id,
            f.name,
            f.color_hex
        FROM wheels_fields wf
        JOIN fields f ON wf.field_id = f.field_id
        WHERE wf.wheel_id = $1
    `, [wheelId]);
    
    return fieldsResult.rows;
};