import { pool } from '@/config/DatabasePool'
import { SignupPayload, LoginPayload, DeletePayload, GetUserInfoPayload } from '@/types'
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
    //TODO
    //надо ли оно

}

export const deleteCurrentUser = async (deletePayload: DeletePayload) => {
    const query = `
        DELETE 
        FROM users
        WHERE login = $1 
    `;
    
    const values = [deletePayload.login];
        
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error('❌ Error during delete user:', error);
        throw error;
    }
}   

export const getUserInfoByName =  async(getUserInfoPayload: GetUserInfoPayload) => {
       const query = `
        SELECT user_id, name 
        FROM users
        WHERE login = $1 LIMIT 1
    `;
    
    const values = [getUserInfoPayload.login];
    try {
        const user = await pool.query(query, values);
        return user
    } catch (error) {
        console.error('❌ Error during get info:', error);
        throw error;
    }
}

export const getUserInfoById = async(getUserInfoPayload: GetUserInfoPayload) => {
       const query = `
        SELECT user_id, name 
        FROM users
        WHERE id = $1 LIMIT 1
    `;
    
    const values = [getUserInfoPayload.id];
    try {
        const user = await pool.query(query, values);
        return user
    } catch (error) {
        console.error('❌ Error during get info:', error);
        throw error;
    }
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