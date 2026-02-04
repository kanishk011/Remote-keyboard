import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Initiate the db table and added new tables 
export const initDatabase = async () => {
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true
    });

    await tempPool.query(`create database if not exists ${process.env.DB_NAME}`);
    await tempPool.end();

    // used to store the 1 - 10 key words with color and who is lit
    await pool.query(`
      create table if not exists keyboard_state (
        key_id int primary key,
         color varchar(10) default 'white',
        lit_by int default null
      )
    `);
      // update the live state
    await pool.query(`
      create table if not exists control_state (
        id int primary key default 1,
        user_id int default null,
        acquired_at datetime default null
      )
    `);

      // insert the 10 record count in keyboard state
    const [rows] = await pool.query('select count(*) as count from keyboard_state');
    if (rows[0].count === 0) {
      for (let i = 1; i <= 10; i++) {
        await pool.query('insert into keyboard_state (key_id, color) values (?, "white")', [i]);
      }
    }
    // Insert initial date row
    const [controlRows] = await pool.query('select count(*) as count from control_state');
    if (controlRows[0].count === 0) {
      await pool.query('insert into control_state (id, user_id, acquired_at) values (1, null, null)');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export default pool;
