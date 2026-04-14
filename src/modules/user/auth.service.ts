import { SignupPayload, LoginPayload, DeletePayload } from '@/modules/user/auth.types'
import { config } from '@/config/env'
import { sign } from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'
import { findUserByLogin, createUser } from '@/modules/user/user.model'
import { ApiResponse } from '@/shared/types/api.types'
import { IUserToken } from './user.types'


export const userSignup = async (signupPayload: SignupPayload): Promise<ApiResponse<IUserToken>> => {
    const { name, login, email, password } = signupPayload;
    
    // Проверяем, существует ли пользователь
    const existingUser = await findUserByLogin(login);
    if (existingUser) {
        throw new Error('User already exists'); 
    }

    try {
        const passwordHash = await hash(password, config.salt)
        const result = await createUser(name, login, email, passwordHash);
        const jwt = await signJWT(login, result.rows[0].user_id, config.secret)
        console.log('✅ user was signup');
        return { 
            message: 'User created successfully',
            success: true,
            data: {
                token: jwt,
                user: { user_id: result.rows[0].user_id, login, name, email, wheels: [], records: [] }
            }
        }
    } catch (error) {
        console.error('❌ Error during signup:', error);
        throw error;
    }
} 

export const userLogin = async (loginPayload: LoginPayload): Promise<ApiResponse<IUserToken>> => {
    const existingUser = await findUserByLogin(loginPayload.login);
    if (!existingUser) {
        throw new Error('User not found');
    }
    const user = existingUser.rows[0];
    const passwordCorrect =  await compare(loginPayload.password, user.password)
    if (!passwordCorrect) {
            throw new Error('wrong password'); 
    }

    try {
        const jwt = await signJWT(loginPayload.login, user.user_id, config.secret)
        const currentUserWheels = [];
        const currentUserRecords = [];
        return {
            message: 'User login successfully',
            success: true,
            data: {
                token: jwt,
                user: { user_id: user.user_id, login: loginPayload.login, name: user.name, email: user.email, wheels: currentUserWheels, records: currentUserRecords }
            }
        }
    } catch (error) {
        console.error('❌ Error during login:', error);
        throw error;
    }
}


// export const logout = () => {
//     //TODO
//     //надо ли оно
// }

// export const deleteCurrentUser = async (deletePayload: DeletePayload) => {
//     const query = `
//         DELETE 
//         FROM users
//         WHERE login = $1 
//     `;
    
//     const values = [deletePayload.login];
        
//     try {
//         await pool.query(query, values);
//     } catch (error) {
//         console.error('❌ Error during delete user:', error);
//         throw error;
//     }
// }   

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