const express = require('express');
const passport = require('passport');
const router = express.Router();

// PERBAIKAN: Mengambil URL frontend dari environment
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Rute Inisiasi Login (Tetap sama)
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user'] }));

// Rute Callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${frontendURL}/login/failed` }),
  (req, res) => {
    // Redirect kembali ke halaman utama frontend yang benar
    res.redirect(frontendURL);
  }
);

// Rute Cek Status Login (Tetap sama)
router.get('/user', (req, res) => { /* ... (kode sama) ... */ });

// Rute Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        // Redirect kembali ke halaman utama frontend yang benar
        res.redirect(frontendURL); 
    });
});

module.exports = router;