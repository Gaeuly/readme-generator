import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gray-800/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Logo and tagline */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-gray-300 font-medium">README.md Generator</span>
          </div>
          
          {/* Made with love */}
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#ef4444', '#f87171', '#ef4444']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart size={14} fill="currentColor" />
            </motion.div>
            <span>for developers</span>
          </div>
          
          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            © 2025 Gaeuly. All rights reserved.
          </p>
          
          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          
          {/* Additional info */}
          <p className="text-gray-600 text-xs text-center max-w-md">
            Create beautiful README files effortlessly with our intuitive markdown editor and live preview.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;