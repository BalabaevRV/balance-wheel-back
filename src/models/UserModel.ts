import { pool } from '@/config/DatabasePool'
import { SignupPayload, LoginPayload } from '@/types'
import { config } from '@/config/env';
import { sign } from 'jsonwebtoken'

export const userSignup = async (signupPayload: SignupPayload)  => {
    const query = `
        INSERT INTO users (name, login, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, login, email
    `;
    
    const values = [signupPayload.name || signupPayload.login, signupPayload.login, signupPayload.login, signupPayload.password];
        
    try {
        await pool.query(query, values);
        console.log('✅ user was signup');
    } catch (error) {
        console.error('❌ Error during signup:', error);
        throw error;
    }
} 

export const userLogin = async (loginPayload: LoginPayload) => {
       const query = `
        SELECT login
        FROM users
        WHERE login = $1 and password = $2 LIMIT 1
    `;
    
    const values = [loginPayload.login, loginPayload.password];
        
    try {
        const user = await pool.query(query, values);
        if (user?.rowCount) {
            const jwt = await signJWT(loginPayload.login, config.secret)
            return jwt
        }
    } catch (error) {
        console.error('❌ Error during signup:', error);
        throw error;
    }
}


export const logout = () => {

}

export const deleteUser = () => {

}   

export const getUserById = () => {

}

const signJWT = (login: string, secret: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sign({login, iat: Math.floor(Date.now() / 1000)}, secret, {algorithm: 'HS256'}, (err, token) => {
            if (err) {
                reject(err)
            }
            resolve(token as string)
        })
    })
}