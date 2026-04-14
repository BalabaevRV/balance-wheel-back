import { pool } from '@/config/database'
import { SignupPayload, LoginPayload, DeletePayload } from '@/modules/users/auth.types'
import { GetUserInfoPayload } from '@/modules/users/user.types'
import { config } from '@/config/env'
import { sign } from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'

export const userSignup = async (signupPayload: SignupPayload)  => {
    const { login, name, email, password } = signupPayload;
    const query = `
        INSERT INTO users (name, login, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, login, email
    `;
    
    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE login = $1 OR email = $2',
      [login, email]
    );
    
    if (existingUser.rows.length > 0) {
        throw new Error('User already exists'); 
    }

    try {
        const passwordHash = await hash(password, config.salt)
        const values = [name, login, email, passwordHash];
        const result = await pool.query(query, values);
        const jwt = await signJWT(login, result.rows[0].user_id, config.secret)
        console.log('✅ user was signup');
        return { 
        message: 'User created successfully',
        success: true,
        token: jwt,
        user: { login, name, email }
    }
    } catch (error) {
        console.error('❌ Error during signup:', error);
        throw error;
    }
} 

export const userLogin = async (loginPayload: LoginPayload) => {
    const query = `
        SELECT  user_id, login, email, password
        FROM users
        WHERE login = $1 LIMIT 1
    `;
    const values = [loginPayload.login];
    const result  = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
    const user = result.rows[0]
    const passwordCorrect =  await compare(loginPayload.password, user.password)
    if (!passwordCorrect) {
            throw new Error('wrong password'); 
    }
        
    try {
        const jwt = await signJWT(loginPayload.login, user.user_id, config.secret)
        return {
            message: 'User login successfully',
            success: true,
            token: jwt,
            user: { login: loginPayload.login }
        }
    } catch (error) {
        console.error('❌ Error during login:', error);
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

export const getUserInfoById = async(getUserInfoPayload: GetUserInfoPayload) => {
       const query = `
        SELECT user_id, name
        FROM users
        WHERE user_id = $1 LIMIT 1
    `;
    const values = [getUserInfoPayload.user_id];
    try {
        const user = await pool.query(query, values);
        if(user.rowCount === 0) {
            throw new Error ('User info not founded')
        }
        return user.rows[0]
    } catch (error) {
        console.error('❌ Error during get info:', error);
        throw error;
    }
}


const signJWT = (login: string, user_id: number, secret: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sign({login, user_id, iat: Math.floor(Date.now() / 1000)}, secret, {algorithm: 'HS256'}, (err, token) => {
            if (err) {
                reject(err)
            }
            resolve(token as string)
        })
    })
}