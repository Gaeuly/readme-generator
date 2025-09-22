import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import custom hook kita

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth(); // Ambil status user dan loading dari context

  // Fungsi untuk redirect ke backend untuk login/logout
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/github';
  };
  const handleLogout = () => {
    window.location.href = 'http://localhost:5001/api/auth/logout';
  };

  const renderAuthButton = () => {
    if (isLoading) {
      // Tampilkan placeholder saat sedang loading
      return <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse"></div>;
    }

    if (user) {
      // Jika user sudah login
      return (
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <img src={user.photos[0].value} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-gray-600" />
            <span className="text-white font-medium text-sm hidden sm:block">{user.displayName}</span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      );
    }

    // Jika user belum login
    return (
      <button
        onClick={handleLogin}
        className="glossy-button px-4 py-2 rounded-lg flex items-center gap-x-2 text-white font-medium"
      >
        <Github size={18} />
        <span>Login with GitHub</span>
      </button>
    );
  };

  return (
    <motion.nav
      // ... (animasi scroll tetap sama) ...
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50"
    >
      {/* ... (background glossy tetap sama) ... */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-white font-semibold text-lg">README Generator</a>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center">
            {renderAuthButton()}
          </div>
          
          {/* Tombol Hamburger */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            // ... (animasi menu mobile tetap sama) ...
            className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 pb-4"
          >
            <div className="px-4 pt-2">
                {renderAuthButton()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
