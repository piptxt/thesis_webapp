const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle PDF upload and text extraction
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        res.json({ text: data.text });
    } catch (error) {
        res.status(500).json({ error: 'Failed to extract text from PDF' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
