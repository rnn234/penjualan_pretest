const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn } = require('../middleware/auth');

// FORM PEMBELIAN
router.get('/beli/:id', isLoggedIn, (req, res) => {
  db.query('SELECT * FROM produk WHERE id = ?', [req.params.id], (err, rows) => {
     if (err) throw err;

    if (rows.length === 0) {
      return res.send('Produk tidak ditemukan.');
    }

    res.render('pembelian/form', { produk: rows[0], error: null });
  });
});

// PROSES PEMBELIAN
router.post('/beli/:id', isLoggedIn, (req, res) => {
  const jumlah = parseInt(req.body.jumlah);
  const id = req.params.id;

  db.query('SELECT * FROM produk WHERE id = ?', [id], (err, rows) => {
    if (err) throw err;
    const produk = rows[0];

    if (produk.stok < jumlah) {
      return res.render('pembelian/form', { produk, error: 'Stok tidak cukup!' });
    }

    const total = produk.harga * jumlah;

    db.query('INSERT INTO pembelian (produk_id, jumlah, total) VALUES (?, ?, ?)',
      [id, jumlah, total],
      () => {
        db.query('UPDATE produk SET stok = stok - ? WHERE id = ?', [jumlah, id], () => {
          res.redirect('/pembelian');
        });
      });
  });
});

// LIST PEMBELIAN
router.get('/pembelian', isLoggedIn, (req, res) => {
  const { dari, sampai } = req.query;

  let query = `
    SELECT pembelian.*, produk.nama AS nama_produk 
    FROM pembelian 
    JOIN produk ON pembelian.produk_id = produk.id
  `;
  let params = [];

  if (dari && sampai) {
    query += ` WHERE DATE(pembelian.tanggal) BETWEEN ? AND ?`;
    params.push(dari, sampai);
  }

  query += ` ORDER BY pembelian.tanggal DESC`;

  db.query(query, params, (err, rows) => {
    if (err) throw err;
    res.render('pembelian/index', {
      pembelian: rows,
      dari: dari || '',
      sampai: sampai || ''
    });
  });
});

// CANCEL PEMBELIAN
router.get('/cancel/:id', isLoggedIn, (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM pembelian WHERE id = ?', [id], (err, rows) => {
    if (err) throw err;
    const pembelian = rows[0];

    db.query('UPDATE produk SET stok = stok + ? WHERE id = ?', [pembelian.jumlah, pembelian.produk_id], () => {
      db.query('DELETE FROM pembelian WHERE id = ?', [id], () => {
        res.redirect('/pembelian');
      });
    });
  });
});

module.exports = router;
