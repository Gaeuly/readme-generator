const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

// --- Konfigurasi Passport (Tetap sama) ---
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // PERBAIKAN: Callback URL dibuat dinamis
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/github/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

const app = express();

// --- Middleware ---

// PERBAIKAN KRITIS: Mengizinkan URL frontend dari environment variables
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: frontendURL, 
  credentials: true 
}));

app.use(express.json());

// Konfigurasi Sesi
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    // PERBAIKAN: Cookie akan menjadi 'secure' di mode produksi
    secure: process.env.NODE_ENV === 'production', 
    // PENTING untuk domain berbeda (Netlify & Railway)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  },
  // PENTING untuk HTTPS di produksi
  proxy: process.env.NODE_ENV === 'production', 
}));

// Inisialisasi Passport (Tetap sama)
app.use(passport.initialize());
app.use(passport.session());


// --- Routes (Tetap sama) ---
const generateRoute = require('./routes/generate');
const authRoute = require('./routes/auth');

app.use('/api/generate', generateRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Backend is alive and kicking!" });
});


// --- Menjalankan Server (Tetap sama) ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});