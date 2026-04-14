import { Pool } from 'pg';

export async function seedFields(pool: Pool) {
    const fields = [
        // Wheel of Life fields (1-6)
        { field_id: 1, name: 'Health', color_hex: '#FF0000' },
        { field_id: 2, name: 'Career', color_hex: '#FF7F00' },
        { field_id: 3, name: 'Finance', color_hex: '#FFFF00' },
        { field_id: 4, name: 'Family', color_hex: '#00FF00' },
        { field_id: 5, name: 'Friends', color_hex: '#0000FF' },
        { field_id: 6, name: 'Personal Growth', color_hex: '#8B00FF' },
        
        // Health Wheel fields (7-10)
        { field_id: 7, name: 'Nutrition', color_hex: '#FF6347' },
        { field_id: 8, name: 'Exercise', color_hex: '#FFD700' },
        { field_id: 9, name: 'Sleep', color_hex: '#1E90FF' },
        { field_id: 10, name: 'Mental Health', color_hex: '#DA70D6' },
        
        // Career Wheel fields (11-14)
        { field_id: 11, name: 'Skills', color_hex: '#20B2AA' },
        { field_id: 12, name: 'Experience', color_hex: '#FF8C00' },
        { field_id: 13, name: 'Network', color_hex: '#32CD32' },
        { field_id: 14, name: 'Growth', color_hex: '#DC143C' },
        
        // Relationships Wheel fields (15-18)
        { field_id: 15, name: 'Family', color_hex: '#FF69B4' },
        { field_id: 16, name: 'Partner', color_hex: '#FF1493' },
        { field_id: 17, name: 'Friends', color_hex: '#00CED1' },
        { field_id: 18, name: 'Community', color_hex: '#9932CC' }
    ];
    
    for (const field of fields) {
        await pool.query(
            `INSERT INTO fields (field_id, name, color_hex)
             VALUES ($1, $2, $3)
             ON CONFLICT (field_id) DO NOTHING`,
            [field.field_id, field.name, field.color_hex]
        );
    }
    console.log('✅ Fields seeded');
}