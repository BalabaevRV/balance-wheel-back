import { Pool } from 'pg';

export async function seedUsersWheels(pool: Pool) {
    const usersWheels = [
        // Sveta (user_id: 1) has wheels 1 and 4
        { user_id: 1, wheel_id: 1 },
        { user_id: 1, wheel_id: 4 },
        
        // John (user_id: 2) has wheel 3
        { user_id: 2, wheel_id: 3 },
        
        // Jane (user_id: 3) has wheel 2
        { user_id: 3, wheel_id: 2 }
    ];
    
    for (const uw of usersWheels) {
        await pool.query(
            `INSERT INTO users_wheels (user_id, wheel_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, wheel_id) DO NOTHING`,
            [uw.user_id, uw.wheel_id]
        );
    }
    console.log('✅ Users_Wheels seeded');
}