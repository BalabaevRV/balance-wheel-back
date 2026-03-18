import { pool } from '@/config/DatabasePool'

export const userSignup = async (login: string, password: string, name: string) => {
        const query = `
            INSERT INTO users (name, login, email, password) 
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, name, login, email
        `;
        
        const values = [name, login, login, password];
        
      try {
    await pool.query(query, values);
    console.log('✅ user was signup');
  } catch (error) {
    console.error('❌ Error during signup:', error);
    throw error;
  }
} 

