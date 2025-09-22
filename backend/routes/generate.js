const express = require('express');
const router = express.Router();
const axios = require('axios');
const git = require('simple-git');
const fs = require('fs');
const path = require('path');

// Ini adalah endpoint utama kita: POST /api/generate
router.post('/', async (req, res) => {
  // 1. Ambil URL repo dari frontend
  const { repoUrl } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required.' });
  }

  // Buat folder sementara untuk kloning repo
  const tempDir = path.join(__dirname, 'temp', Date.now().toString());

  try {
    // 2. Analisis URL dan dapatkan info dasar
    const repoPathMatch = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (!repoPathMatch) {
      return res.status(400).json({ error: 'Invalid GitHub URL format.' });
    }
    const repoPath = repoPathMatch[1];

    // 3. Panggil GitHub API untuk mendapatkan default branch
    const repoDetails = await axios.get(`https://api.github.com/repos/${repoPath}`, {
      headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
    });
    const defaultBranch = repoDetails.data.default_branch;

    // 4. Kloning repo ke folder sementara
    console.log(`Cloning ${repoUrl} into ${tempDir}...`);
    await git().clone(repoUrl, tempDir, [`--branch=${defaultBranch}`, '--depth=1']);
    console.log('Clone successful.');

    // 5. Baca file package.json (jika ada)
    let packageJsonContent = null;
    const packageJsonPath = path.join(tempDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('package.json found. Reading content...');
      const rawData = fs.readFileSync(packageJsonPath);
      packageJsonContent = JSON.parse(rawData);
    }

    // 6. Buat prompt yang sangat detail untuk AI
    let analysis = `Project Name: ${packageJsonContent?.name || repoDetails.data.name}\n`;
    analysis += `Description: ${packageJsonContent?.description || repoDetails.data.description}\n`;
    analysis += `Dependencies: ${packageJsonContent?.dependencies ? Object.keys(packageJsonContent.dependencies).join(', ') : 'Not found.'}\n`;
    analysis += `Scripts: ${packageJsonContent?.scripts ? JSON.stringify(packageJsonContent.scripts) : 'Not found.'}\n`;

    const prompt = `
      Based on the following analysis of a GitHub repository, create a professional README.md.
      The analysis was done by cloning the repo and reading its package.json.
      
      ANALYSIS:
      ${analysis}

      INSTRUCTIONS:
      - Use the analysis to suggest accurate installation and run commands.
      - Create a beautiful and well-structured markdown file.
      - The output must be ONLY the raw markdown content.
    `;

    // 7. Panggil Gemini AI
    console.log('Calling Gemini AI...');
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    
    const readmeContent = geminiResponse.data.candidates[0].content.parts[0].text;
    console.log('AI response received.');

    // 8. Kirim hasil kembali ke frontend
    res.status(200).json({ readme: readmeContent });

  } catch (error) {
    console.error('Error during generation:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 9. SANGAT PENTING: Bersihkan folder sementara
    if (fs.existsSync(tempDir)) {
      console.log(`Cleaning up temporary directory: ${tempDir}`);
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

module.exports = router;