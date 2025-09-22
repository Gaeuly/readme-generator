const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

// --- Konfigurasi Passport ---
// Ini memberitahu Passport cara menyimpan dan mengambil data user dari sesi.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Ini adalah strategi login GitHub.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback" // URL ini harus sama persis dengan yang di GitHub
  },
  (accessToken, refreshToken, profile, done) => {
    // Di sini kita bisa menyimpan user ke database jika perlu.
    // Untuk sekarang, kita langsung teruskan saja profil dari GitHub.
    return done(null, profile);
  }
));

const app = express();

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:5173", // Hanya izinkan request dari frontend
  credentials: true // Izinkan pengiriman cookie
}));
app.use(express.json());

// Konfigurasi Sesi
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Sesi berlaku 24 jam
    secure: false, // Set ke `true` saat sudah di HTTPS (deploy)
  }
}));

// Inisialisasi Passport
app.use(passport.initialize());
app.use(passport.session());


// --- Routes ---
const generateRoute = require('./routes/generate');
const authRoute = require('./routes/auth'); // Import rute auth baru

app.use('/api/generate', generateRoute);
app.use('/api/auth', authRoute); // Gunakan rute auth

app.get('/', (req, res) => {
  res.status(200).json({ message: "Backend is alive and kicking!" });
});


// --- Menjalankan Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});