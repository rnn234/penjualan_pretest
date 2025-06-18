const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
const produkRoutes = require('./routes/produk');
app.use('/produk', produkRoutes);
const pembelianRoutes = require('./routes/pembelian');
app.use('/', pembelianRoutes);
const chatRouter = require('./routes/chat');
app.use(chatRouter);





// Server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
