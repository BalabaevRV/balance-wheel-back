import { Pool } from 'pg';

export async function seedRecordValues(pool: Pool) {
    const recordValues = [
        // Record 1 (Wheel of Life, March 17)
        { record_id: 1, field_id: 1, value: 7 },
        { record_id: 1, field_id: 2, value: 8 },
        { record_id: 1, field_id: 3, value: 6 },
        { record_id: 1, field_id: 4, value: 9 },
        { record_id: 1, field_id: 5, value: 5 },
        { record_id: 1, field_id: 6, value: 7 },
        
        // Record 2 (Wheel of Life, April 2)
        { record_id: 2, field_id: 1, value: 2 },
        { record_id: 2, field_id: 2, value: 3 },
        { record_id: 2, field_id: 3, value: 1 },
        { record_id: 2, field_id: 4, value: 2 },
        { record_id: 2, field_id: 5, value: 9 },
        { record_id: 2, field_id: 6, value: 4 },
        
        // Record 3 (Health Wheel)
        { record_id: 3, field_id: 7, value: 6 },
        { record_id: 3, field_id: 8, value: 7 },
        { record_id: 3, field_id: 9, value: 8 },
        { record_id: 3, field_id: 10, value: 9 }
    ];
    
    for (const rv of recordValues) {
        await pool.query(
            `INSERT INTO record_values (record_id, field_id, value)
             VALUES ($1, $2, $3)
             ON CONFLICT (record_id, field_id) DO NOTHING`,
            [rv.record_id, rv.field_id, rv.value]
        );
    }
    console.log('✅ Record_Values seeded');
}