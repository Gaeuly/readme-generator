import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import clsx from 'clsx';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">
              README.md Generator
            </span>
          </motion.div>

          {/* GitHub Login Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              "glossy-button px-4 py-2 rounded-lg",
              "flex items-center space-x-2 text-white font-medium",
              "hover:from-gray-600/80 hover:to-gray-700/80"
            )}
          >
            <Github size={18} />
            <span>Login with GitHub</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;