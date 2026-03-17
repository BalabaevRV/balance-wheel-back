// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

// Определяем какое окружение загружать
const envFile = '.env';

// Загружаем переменные окружения из соответствующего файла
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Валидация переменных окружения
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME'
];

// Проверяем наличие обязательных переменных
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Warning: ${envVar} is not set in ${envFile}`);
  }
}

export const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'myapp_dev'
} as const;

// Типизация конфига
export type Config = typeof config;