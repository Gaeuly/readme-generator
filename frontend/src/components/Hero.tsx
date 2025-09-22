import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToGenerator = () => {
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // PERBAIKAN 1: Jarak Section & Background Utama
    // - Dihapus: `min-h-screen`. Diganti padding responsif `py-24 sm:py-32` agar jaraknya pas.
    // - Ditambah: `bg-black relative overflow-hidden` untuk dasar background glossy.
    <section className="bg-black relative overflow-hidden py-24 sm:py-32 flex items-center justify-center">
      
      {/* PERBAIKAN 2: Background Glossy Abu-abu di Pojok (Tanpa CSS Eksternal) */}
      {/* Efek cahaya glossy di pojok kiri atas */}
      <div className="absolute top-[-20rem] left-[-20rem] w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(156,163,175,0.15)_0%,transparent_60%)] rounded-full pointer-events-none"></div>
      {/* Efek cahaya glossy di pojok kanan bawah */}
      <div className="absolute bottom-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_60%)] rounded-full pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* PERBAIKAN 3: Ukuran Font Responsif untuk Semua Perangkat */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter">
            Generate Your Next{' '}
            <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
              README.md
            </span>
            <span className="text-cyan-400">.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Instantly create professional, beautiful, and well-structured documentation for your projects using the power of AI.
          </p>

          <motion.button
            onClick={scrollToGenerator}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            // Menggunakan style glossy button dari index.css yang sudah kamu buat
            className="glossy-button px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg flex items-center gap-x-2 mx-auto hover:border-gray-600 hover:shadow-cyan-500/10"
          >
            <span>Start Generating</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={20} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
