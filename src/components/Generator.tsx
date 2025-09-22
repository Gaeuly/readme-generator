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

## Usage

\`\`\`javascript
const project = require('my-awesome-project');
console.log('Hello World!');
\`\`\`

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
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
      return { __html: marked(markdown) };
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
    <section id="generator" className="min-h-screen py-20 bg-black">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-4"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your README
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Write markdown on the left, see the preview on the right. It's that simple.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4 mb-8"
        >
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              "glossy-button px-6 py-3 rounded-lg",
              "flex items-center space-x-2 text-white font-medium",
              copied ? "from-green-700/80 to-green-800/80" : "hover:from-gray-600/80 hover:to-gray-700/80"
            )}
          >
            <Copy size={18} />
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </motion.button>

          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              "glossy-button px-6 py-3 rounded-lg",
              "flex items-center space-x-2 text-white font-medium",
              "hover:from-gray-600/80 hover:to-gray-700/80"
            )}
          >
            <Download size={18} />
            <span>Download README.md</span>
          </motion.button>
        </motion.div>

        {/* Editor and Preview */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Editor */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glossy-card rounded-2xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 size={20} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Editor</h3>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className={clsx(
                "w-full h-96 bg-gray-900/50 border border-gray-700/50 rounded-xl",
                "p-4 text-gray-200 font-mono text-sm leading-relaxed",
                "focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent",
                "resize-none backdrop-blur-sm"
              )}
              placeholder="Enter your markdown here..."
              spellCheck={false}
            />
          </motion.div>

          {/* Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glossy-card rounded-2xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Eye size={20} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Preview</h3>
            </div>
            <div 
              className={clsx(
                "w-full h-96 bg-gray-900/50 border border-gray-700/50 rounded-xl",
                "p-4 overflow-auto backdrop-blur-sm markdown-preview"
              )}
              dangerouslySetInnerHTML={getPreviewHtml()}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Generator;