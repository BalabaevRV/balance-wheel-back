import { Client } from 'pg'
  // Подключаемся к стандартной БД postgres

async function createDatabase() {
  // Подключаемся к стандартной БД postgres
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres', // пользователь с правами на создание БД
    password: 'admin',
    database: 'postgres' // подключаемся к существующей БД
  });

  try {
    await client.connect();
    
    // Проверяем существование БД
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'balance_wheels'"
    );
    
    if (checkDb.rows.length === 0) {
      // Создаем новую БД
      await client.query('CREATE DATABASE my_new_database');
      console.log('База данных создана успешно');
    } else {
      console.log('База данных уже существует');
    }
    
  } catch (error) {
    console.error('Ошибка при создании БД:', error);
  } finally {
    await client.end();
  }
}

createDatabase();