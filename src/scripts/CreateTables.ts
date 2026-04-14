import { pool } from '@/config/database';

export async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      login VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ Table "users" created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

export async function createWheelsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS wheels (
        wheel_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        interval_seconds INTEGER
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ Table "wheels" created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

export async function createFieldsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS fields (
        field_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        color_hex VARCHAR(7) NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ Table "fields" created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

export async function createUsersWheelsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users_wheels (
      user_id INTEGER NOT NULL,
      wheel_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, wheel_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (wheel_id) REFERENCES wheels(wheel_id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_wheels_user ON users_wheels(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_wheels_wheel ON users_wheels(wheel_id);
  `;
  
  await pool.query(query);
}

export async function createWheelsFieldsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS wheels_fields (
      wheel_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      PRIMARY KEY (wheel_id, field_id),
      FOREIGN KEY (wheel_id) REFERENCES wheels(wheel_id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_wheels_fields_wheel ON wheels_fields(wheel_id);
    CREATE INDEX IF NOT EXISTS idx_wheels_fields_field ON wheels_fields(field_id);
  `;
  
  await pool.query(query);
}

export async function createRecordsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS records (
      record_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      wheel_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      value INTEGER NOT NULL CHECK (value >= 0 AND value <= 10),
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (wheel_id) REFERENCES wheels(wheel_id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE,
      UNIQUE(user_id, wheel_id, field_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_records_user_date ON records(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_records_wheel ON records(wheel_id);
    CREATE INDEX IF NOT EXISTS idx_records_field ON records(field_id);
    CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
    
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    DROP TRIGGER IF EXISTS update_records_updated_at ON records;
    CREATE TRIGGER update_records_updated_at
      BEFORE UPDATE ON records
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    await pool.query(query);
    console.log('✅ Table "records" created successfully');
  } catch (error) {
    console.error('❌ Error creating records table:', error);
    throw error;
  }
}


export function createAllTables() {
  createUsersTable()
  createWheelsTable()
  createFieldsTable()
  createUsersWheelsTable()
  createWheelsFieldsTable()
  createRecordsTable()
}
