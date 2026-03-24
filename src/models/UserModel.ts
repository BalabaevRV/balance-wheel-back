import { pool } from '@/config/DatabasePool'
import { SignupPayload } from '@/types'

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

export const login = (login: string, password: string) => {

}


export const logout = () => {

}

