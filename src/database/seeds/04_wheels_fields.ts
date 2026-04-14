import { Pool } from 'pg';

export async function seedWheelsFields(pool: Pool) {
    const wheelsFields = [
        // Wheel of Life (wheel_id: 1) → fields 1-6
        { wheel_id: 1, field_id: 1 },
        { wheel_id: 1, field_id: 2 },
        { wheel_id: 1, field_id: 3 },
        { wheel_id: 1, field_id: 4 },
        { wheel_id: 1, field_id: 5 },
        { wheel_id: 1, field_id: 6 },
        
        // Health Wheel (wheel_id: 2) → fields 7-10
        { wheel_id: 2, field_id: 7 },
        { wheel_id: 2, field_id: 8 },
        { wheel_id: 2, field_id: 9 },
        { wheel_id: 2, field_id: 10 },
        
        // Career Wheel (wheel_id: 3) → fields 11-14
        { wheel_id: 3, field_id: 11 },
        { wheel_id: 3, field_id: 12 },
        { wheel_id: 3, field_id: 13 },
        { wheel_id: 3, field_id: 14 },
        
        // Relationships Wheel (wheel_id: 4) → fields 15-18
        { wheel_id: 4, field_id: 15 },
        { wheel_id: 4, field_id: 16 },
        { wheel_id: 4, field_id: 17 },
        { wheel_id: 4, field_id: 18 }
    ];
    
    for (const wf of wheelsFields) {
        await pool.query(
            `INSERT INTO wheels_fields (wheel_id, field_id)
             VALUES ($1, $2)
             ON CONFLICT (wheel_id, field_id) DO NOTHING`,
            [wf.wheel_id, wf.field_id]
        );
    }
    console.log('✅ Wheels_Fields seeded');
}