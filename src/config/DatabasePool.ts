import { Pool } from 'pg';
import { config } from './env';

export const pool = new Pool({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Тестирование подключения
pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});