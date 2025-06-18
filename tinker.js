// tinker.js
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'penjualan'
});

// Data user
const username = 'admin';
const password = 'admin123';
const saltRounds = 10;

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Gagal konek ke database:', err);
    return;
  }

  console.log('Terhubung ke database');

  // Hash password dan simpan user
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Gagal hash password:', err);
      return;
    }

    const query = 'INSERT INTO user (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Gagal menyimpan user:', err);
        return;
      }

      console.log(`User '${username}' berhasil disimpan dengan ID: ${results.insertId}`);
      db.end(); // Tutup koneksi
    });
  });
});
