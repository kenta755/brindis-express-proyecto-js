const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'brazzino'
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('Current users in DB:', rows.map(u => ({ id: u.id, email: u.email, role: u.role })));

    const adminEmail = 'admin@brazzino.com';
    const adminEmailAlt = 'admin@brazzinos.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const emails = [adminEmail, adminEmailAlt];

    for (const email of emails) {
      const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO users (email, nombre, apellido, password, role, activo) VALUES (?, ?, ?, ?, ?, ?)',
          [email, 'Admin', 'Principal', hashedPassword, 'admin', 1]
        );
        console.log(`Created admin: ${email} / ${adminPassword}`);
      } else {
        await connection.execute(
          'UPDATE users SET password = ?, role = "admin", activo = 1 WHERE email = ?',
          [hashedPassword, email]
        );
        console.log(`Updated admin: ${email} / ${adminPassword}`);
      }
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

setup();
