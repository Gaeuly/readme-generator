import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Eye, Edit3 } from 'lucide-react';
import { marked } from 'marked';
import clsx from 'clsx';

const Generator: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# My Awesome Project

A brief description of what this project does and who it's for.

## Features

- 🚀 Feature one
- ⚡ Feature two  
- 🎨 Feature three

## Installation

\`\`\`bash
npm install my-awesome-project
\`\`\`
`);
  
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown]);

  const getPreviewHtml = useCallback(() => {
    try {
      // Menambahkan opsi breaks: true agar preview rapi
      return { __html: marked(markdown, { breaks: true }) };
    } catch (error) {
      return { __html: '<p class="text-red-400">Error parsing markdown</p>' };
    }
  }, [markdown]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    // PERBAIKAN 1: Menyesuaikan Jarak & Latar Belakang
    // - Dihapus: `min-h-screen bg-black`.
    // - Diganti: `relative overflow-hidden` dan padding `pt-0 pb-24 sm:pb-32`.
    //   pt-0 digunakan agar tidak ada jarak tambahan dari section Hero.
    <section id="generator" className="relative overflow-hidden pt-0 pb-24 sm:pb-32">
      
      {/* PERBAIKAN 2: Menambahkan Efek Background Glossy yang Sama */}
      <div className="absolute top-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_60%)] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-30rem] left-[-20rem] w-[60rem] h-[60rem] bg-[radial-gradient(circle,rgba(156,163,175,0.15)_0%,transparent_60%)] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your README
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Write markdown on the left, see the live preview on the right. It's that simple.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              "glossy-button px-5 py-2.5 rounded-lg",
              "flex items-center gap-x-2 text-white font-medium transition-colors",
              copied ? "bg-green-500/20 border-green-500/30" : ""
            )}
          >
            <Copy size={18} />
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </motion.button>

          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glossy-button px-5 py-2.5 rounded-lg flex items-center gap-x-2 text-white font-medium"
          >
            <Download size={18} />
            <span>Download .md</span>
          </motion.button>
        </motion.div>

        {/* Editor and Preview Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Editor Card */}
          <div className="glossy-card rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 size={20} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Editor</h3>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 sm:h-[500px] bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-gray-200 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              placeholder="Enter your markdown here..."
              spellCheck={false}
            />
          </div >

          {/* Preview Card */}
          <div className="glossy-card rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye size={20} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Preview</h3>
            </div>
            <div 
              className="w-full h-96 sm:h-[500px] bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 overflow-auto markdown-preview"
              dangerouslySetInnerHTML={getPreviewHtml()}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Generator;
