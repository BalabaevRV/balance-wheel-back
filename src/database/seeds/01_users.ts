import { Pool } from 'pg';
import { config } from '@/config/env'
import { hash } from 'bcryptjs'

export async function seedUsers(pool: Pool) {
    const passwordHash = await hash('password123', config.salt)
    
    const users = [
        { user_id: 1, login: 'SvetaEng', email: 'sveta@gmail.com', name: 'Sveta', password: passwordHash },
        { user_id: 2, login: 'JohnDoe', email: 'john@gmail.com', name: 'John', password: passwordHash },
        { user_id: 3, login: 'JaneSmith', email: 'jane@gmail.com', name: 'Jane', password: passwordHash }
    ];
    
    for (const user of users) {
        await pool.query(
            `INSERT INTO users (user_id, login, email, name, password, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id) DO NOTHING`,
            [user.user_id, user.login, user.email, user.name, user.password]
        );
    }
    console.log('✅ Users seeded');
}