import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function createConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

export async function initializeDatabase() {
    const connection = await createConnection();

    // Drop table if it exists and recreate with proper schema
    await connection.execute(`DROP TABLE IF EXISTS users`);
    
    await connection.execute(`
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            isVerify BOOLEAN DEFAULT FALSE,
            verificationToken VARCHAR(255),
            roles JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    return connection;
}
