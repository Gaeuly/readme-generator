import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Github, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  // State untuk mengelola menu mobile (hamburger)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State untuk menyembunyikan navbar saat scroll
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hook canggih dari Framer Motion untuk mendeteksi perubahan scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsHidden(true); // Scroll ke bawah, sembunyikan navbar
    } else {
      setIsHidden(false); // Scroll ke atas, tampilkan navbar
    }
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // PERBAIKAN 4: Navbar akan ber-animasi (turun/naik) berdasarkan state `isHidden`
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50"
    >
      {/* PERBAIKAN 3: Background glossy yang sama dengan section lain */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[20rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_40%)] pointer-events-none"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* PERBAIKAN 2: Logo disederhanakan, ikon 'R' dihapus */}
          <div className="flex-shrink-0">
            <a href="#" className="text-white font-semibold text-lg tracking-tight">
              README Generator
            </a>
          </div>

          {/* Menu Desktop (muncul di layar medium ke atas) */}
          <div className="hidden md:flex items-center">
            <a
              href="#" // Nanti bisa diganti dengan link login
              className="glossy-button px-4 py-2 rounded-lg flex items-center gap-x-2 text-white font-medium"
            >
              <Github size={18} />
              <span>Login with GitHub</span>
            </a>
          </div>

          {/* PERBAIKAN 1: Tombol Hamburger Menu (hanya muncul di mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Konten Menu Mobile yang bisa slide down */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 pb-4"
          >
            <div className="px-4 pt-2">
              <a
                href="#" // Nanti bisa diganti dengan link login
                className="glossy-button w-full px-4 py-3 rounded-lg flex items-center justify-center gap-x-2 text-white font-medium"
              >
                <Github size={18} />
                <span>Login with GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
