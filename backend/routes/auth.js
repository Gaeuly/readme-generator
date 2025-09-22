const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rute 1: Inisiasi Login
// Saat frontend mengarahkan ke alamat ini, Passport akan mengalihkan ke halaman login GitHub.
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user'] }));

// Rute 2: Callback dari GitHub
// Setelah user login di GitHub, GitHub akan mengarahkan kembali ke alamat ini.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login/failed' }),
  (req, res) => {
    // Jika berhasil, redirect kembali ke halaman utama frontend
    // Nanti ganti dengan URL Netlify-mu
    res.redirect('https://readmemd-generator.netlify.app/');
  }
);

// Rute 3: Cek Status Login
// Frontend akan memanggil ini untuk mengetahui siapa yang sedang login.
router.get('/user', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'User is authenticated',
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'User is not authenticated',
    });
  }
});

// Rute 4: Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('https://readmemd-generator.netlify.app/'); // Redirect ke frontend setelah logout
    });
});

module.exports = router;
