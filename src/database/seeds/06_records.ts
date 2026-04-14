import { Pool } from 'pg';

export async function seedRecords(pool: Pool) {
    const records = [
        { record_id: 1, wheel_id: 1, user_id: 1, date: '2026-03-17' },
        { record_id: 2, wheel_id: 1, user_id: 1, date: '2026-04-02' },
        { record_id: 3, wheel_id: 2, user_id: 1, date: '2026-03-17' }
    ];
    
    for (const record of records) {
        await pool.query(
            `INSERT INTO records (record_id, wheel_id, user_id, date, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())
             ON CONFLICT (record_id) DO NOTHING`,
            [record.record_id, record.wheel_id, record.user_id, record.date]
        );
    }
    console.log('✅ Records seeded');
}