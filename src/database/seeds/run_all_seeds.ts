import { pool } from '@/config/database';
import { seedUsers } from './01_users';
import { seedFields } from './02_fields';
import { seedWheels } from './03_wheels';
import { seedWheelsFields } from './04_wheels_fields';
import { seedUsersWheels } from './05_users_wheels';
import { seedRecords } from './06_records';
import { seedRecordValues } from './07_record_values';


async function runAllSeeds() {
    try {
        console.log('🌱 Starting seeds...\n');
        
        await seedUsers(pool);
        await seedFields(pool);
        await seedWheels(pool);
        await seedWheelsFields(pool);
        await seedUsersWheels(pool);
        await seedRecords(pool);
        await seedRecordValues(pool);
        
        console.log('\n✅ All seeds completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await pool.end();
    }
}

runAllSeeds();