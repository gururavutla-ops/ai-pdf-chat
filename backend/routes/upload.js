const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();

// Store uploaded files in memory (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Store extracted PDF text temporarily
let extractedText = '';

// POST /upload — receives a PDF and extracts its text
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from the PDF
    const data = await pdfParse(req.file.buffer);
    extractedText = data.text;

    res.json({ 
      message: 'PDF uploaded successfully!',
      pages: data.numpages,
      characters: extractedText.length
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to read PDF' });
  }
});

// Export extractedText so the chat route can use it
module.exports = router;
module.exports.getText = () => extractedText;