const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// GET Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST Login proses
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM user WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.render('login', { error: 'Admin tidak ditemukan' });
    }

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);

    if (match) {
      req.session.adminId = admin.id;
      req.session.username = admin.username;
      return res.redirect('/dashboard');
    } else {
      return res.render('login', { error: 'Password salah' });
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
