const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn } = require('../middleware/auth');

// Halaman utama produk

router.get('/', isLoggedIn, (req, res) => {
  db.query('SELECT * FROM produk', (err, rows) => {
    res.render('produk/index', { produk: rows });
  });
});

// Form tambah produk

router.get('/tambah', isLoggedIn, (req, res) => {
  res.render('produk/tambah');
});

// Proses 
router.post('/tambah', isLoggedIn, (req, res) => {
  const { nama, harga, stok } = req.body;
  db.query('INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)', [nama, harga, stok], () => {
    res.redirect('/produk');
  });
});

// Edit 
router.get('/edit/:id', isLoggedIn, (req, res) => {
  db.query('SELECT * FROM produk WHERE id = ?', [req.params.id], (err, rows) => {
    res.render('produk/edit', { produk: rows[0] });
  });
});

// Proses edit
router.post('/edit/:id', isLoggedIn, (req, res) => {
  const { nama, harga } = req.body;
  db.query('UPDATE produk SET nama = ?, harga = ? WHERE id = ?', [nama, harga, req.params.id], () => {
    res.redirect('/produk');
  });
});

// edit stok
router.get('/restock/:id', isLoggedIn, (req, res) => {
  db.query('SELECT * FROM produk WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) throw err;
    res.render('produk/restock', { produk: rows[0] });
  });
});
// restock
router.post('/restock/:id', isLoggedIn, (req, res) => {
  const tambah = parseInt(req.body.jumlah);
  db.query('UPDATE produk SET stok = stok + ? WHERE id = ?', [tambah, req.params.id], () => {
    res.redirect('/produk');
  });
});

module.exports = router;
