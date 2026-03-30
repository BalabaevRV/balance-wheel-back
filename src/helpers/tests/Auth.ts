import app from '@/app'
import request from 'supertest'
import { pool } from '@/config/DatabasePool'
import { hash } from 'bcryptjs';
import { config } from '@/config/env'
import { TestUser } from '@/types/tests'

let userId: number
const userData:TestUser = {
    name: 'Billy Jean',
    login: 'billy_jean',
    email: 'billy@example.com',
    password: 'SecurePass12345!',
    userId: 0,
    authToken: ''
}

export const getAuthToken = async ():Promise<typeof userData> => {
    const existingUser = await pool.query('SELECT user_id FROM users WHERE login = $1 LIMIT 1', [userData.login]);
    if (existingUser.rowCount === 0) {
        const passwordHash = await hash(userData.password, config.salt)
        const createUserResult = await pool.query('INSERT INTO users (name, login, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, name, login, email', [userData.name, userData.login, userData.email, passwordHash])
        userData.userId = createUserResult.rows[0].user_id
    } else {
        userData.userId = existingUser.rows[0].user_id
    }
    const loginResponse = await request(app)
        .post('/api/login')
        .send({
            login: userData.login,
            password: userData.password
        });
        userData.authToken = loginResponse.body.token;
    return userData;
}