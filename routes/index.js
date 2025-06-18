// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Halo! Proyek berhasil dijalankan.');
});

const { isLoggedIn } = require('../middleware/auth');

router.get('/dashboard', isLoggedIn, (req, res) => {
  res.send(`Halo Admin, selamat datang <b>${req.session.username}</b>! <a href="/produk">produk</a> | <a href="/pembelian">Riwayat</a> | <a href="/logout">Logout</a>`);
});

module.exports = router;
