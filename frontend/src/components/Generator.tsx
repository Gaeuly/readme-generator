import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { marked } from 'marked';
import clsx from 'clsx';
import EditorControls from './EditorControls'; // Asumsi kita akan buat komponen ini

// Komponen kecil untuk menampilkan pesan status (loading, error, success)
const StatusMessage: React.FC<{ type: 'loading' | 'error' | 'success' | 'idle'; message: string }> = ({ type, message }) => {
  if (!message || type === 'idle') return null;

  const icons = {
    loading: <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>,
    error: <AlertTriangle size={20} className="text-red-400" />,
    success: <CheckCircle size={20} className="text-green-400" />,
    idle: null
  };

  const colors = {
    loading: 'bg-gray-700/50 border-gray-600',
    error: 'bg-red-900/50 border-red-700 text-red-300',
    success: 'bg-green-900/50 border-green-700 text-green-300',
    idle: ''
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx('flex items-center gap-x-3 p-4 rounded-lg border', colors[type])}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

const Generator: React.FC = () => {
  // --- State Management ---
  const [repoUrl, setRepoUrl] = useState('');
  const [markdown, setMarkdown] = useState('// Your generated README will appear here...');
  const [status, setStatus] = useState<{ type: 'loading' | 'error' | 'success' | 'idle'; message: string }>({ type: 'idle', message: '' });
  
  // --- Fungsi Utama untuk Memanggil Backend ---
  const handleGenerate = async () => {
    if (!repoUrl) {
      setStatus({ type: 'error', message: 'Please enter a GitHub repository URL.' });
      return;
    }
    
    setStatus({ type: 'loading', message: 'Analyzing repository and generating README...' });
    setMarkdown(''); // Kosongkan hasil sebelumnya

    try {
      // Alamat backend kita (pastikan backend berjalan di port 5001)
      const backendUrl = 'http://localhost:5001/api/generate';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }), // Kirim URL repo ke backend
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika backend mengirim error, tampilkan pesannya
        throw new Error(data.error || 'An unknown error occurred.');
      }

      // Jika berhasil, update state markdown dengan hasil dari backend
      setMarkdown(data.readme);
      setStatus({ type: 'success', message: 'README generated successfully!' });

    } catch (error: any) {
      console.error('API call failed:', error);
      setStatus({ type: 'error', message: error.message });
      setMarkdown(`# Generation Failed\n\nAn error occurred: \n\`\`\`\n${error.message}\n\`\`\``);
    }
  };

  // --- Fungsi Bantuan Preview ---
  const getPreviewHtml = useCallback(() => {
    try {
      // Opsi untuk membuat baris baru menjadi <br>
      marked.setOptions({ breaks: true });
      return { __html: marked(markdown) };
    } catch (error) {
      return { __html: '<p class="text-red-400">Error parsing markdown</p>' };
    }
  }, [markdown]);

  // (Varian animasi Framer Motion tetap sama)
  const containerVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <section id="generator" className="relative overflow-hidden pt-0 pb-24 sm:pb-32">
       <div className="absolute top-0 left-0 -translate-x-1/4 w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_50%)] pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 translate-x-1/4 w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,transparent_50%)] pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* --- Input Section --- */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 glossy-card p-4 rounded-2xl">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Paste your public GitHub repository URL here..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
              disabled={status.type === 'loading'}
            />
            <motion.button
              onClick={handleGenerate}
              disabled={status.type === 'loading'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glossy-button w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-x-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              <span>Generate</span>
            </motion.button>
          </div>
        </motion.div>

        {/* --- Status Message Display --- */}
        <div className="max-w-3xl mx-auto mb-8 h-16">
          <AnimatePresence>
            <StatusMessage type={status.type} message={status.message} />
          </AnimatePresence>
        </div>

        {/* --- Editor and Preview Section --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="glossy-card rounded-2xl p-1 sm:p-2">
            <EditorControls content={markdown} setStatus={setStatus} />
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 sm:h-[500px] bg-gray-900/80 border-none rounded-b-xl p-4 font-mono text-sm focus:outline-none focus:ring-0 resize-none"
              spellCheck={false}
              readOnly={status.type === 'loading'}
            />
          </div>
          {/* Preview */}
          <div className="glossy-card rounded-2xl p-1 sm:p-2">
             <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
                <h3 className="text-sm font-semibold text-white flex items-center gap-x-2">
                    <Eye size={16} />
                    <span>Live Preview</span>
                </h3>
            </div>
            <div 
              className="w-full h-96 sm:h-[500px] bg-gray-900/80 rounded-b-xl p-4 overflow-auto markdown-preview"
              dangerouslySetInnerHTML={getPreviewHtml()}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Kita buat komponen terpisah untuk tombol-tombol di atas editor
const EditorControls: React.FC<{ content: string; setStatus: Function }> = ({ content, setStatus }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setStatus({type: 'success', message: 'Copied to clipboard!'});
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setStatus({type: 'error', message: 'Failed to copy.'});
        }
    }, [content, setStatus]);

    const handleDownload = useCallback(() => {
        try {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'README.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStatus({type: 'success', message: 'Download started!'});
        } catch (error) {
            setStatus({type: 'error', message: 'Failed to download file.'});
        }
    }, [content, setStatus]);

    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
            <h3 className="text-sm font-semibold text-white flex items-center gap-x-2">
                <Edit3 size={16} />
                <span>Editor</span>
            </h3>
            <div className="flex items-center gap-x-2">
                <button onClick={handleCopy} className="text-gray-400 hover:text-white p-2 rounded-md transition-colors">
                    {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
                <button onClick={handleDownload} className="text-gray-400 hover:text-white p-2 rounded-md transition-colors">
                    <Download size={16} />
                </button>
            </div>
        </div>
    );
};

export default Generator;