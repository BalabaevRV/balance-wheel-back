import { Pool } from 'pg';

export async function seedWheels(pool: Pool) {
    const wheels = [
        { wheel_id: 1, owner_id: 1, name: 'Wheel of Life', interval_seconds: 86400 },
        { wheel_id: 2, owner_id: 3, name: 'Health Wheel', interval_seconds: 86400 },
        { wheel_id: 3, owner_id: 2, name: 'Career Wheel', interval_seconds: 86400 },
        { wheel_id: 4, owner_id: 1, name: 'Relationships Wheel', interval_seconds: 86400 }
    ];
    
    for (const wheel of wheels) {
        await pool.query(
            `INSERT INTO wheels (wheel_id, owner_id, name, interval_seconds, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())
             ON CONFLICT (wheel_id) DO NOTHING`,
            [wheel.wheel_id, wheel.owner_id, wheel.name, wheel.interval_seconds]
        );
    }
    console.log('✅ Wheels seeded');
}