import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'creacion_productos',
    password: '123456',
    port: 5432
})
export default pool;