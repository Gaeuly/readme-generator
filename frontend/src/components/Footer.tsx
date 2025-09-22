import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react'; // Import ikon GitHub

const Footer: React.FC = () => {
  return (
    // PERBAIKAN 1: Menambahkan background glossy yang konsisten
    <footer className="relative overflow-hidden border-t border-gray-800/50">
      
      {/* Efek cahaya glossy di tengah bawah */}
      <div className="absolute bottom-[-10rem] left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_70%)] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* PERBAIKAN 2: Menyederhanakan layout menjadi satu baris */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Copyright text */}
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Gaeuly. All rights reserved.
          </p>
          
          {/* PERBAIKAN 3: Menambahkan Ikon GitHub */}
          <a
            href="https://github.com/Gaeuly/readme-generator" // Ganti dengan URL repo kamu yang benar
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-300"
            aria-label="GitHub Repository"
          >
            <Github size={24} />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
