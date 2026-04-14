import { pool } from '@/config/database'

export const findUserByLogin = async (login: string)  => {
    const query = 'SELECT * FROM users WHERE login = $1 LIMIT 1';
    const result = await pool.query(query, [login]);
    return result.rows[0] || null;
}

export const createUser = async (name: string, login: string, email: string, password: string)  => {
    const query = `
        INSERT INTO users (name, login, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, login, email
    `
    const result = await pool.query(query, [name, login, email, password]);
    return result.rows[0] || null;
}
