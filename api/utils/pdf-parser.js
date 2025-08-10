const pdf = require('pdf-parse');

async function extractTextFromPdf(filePath) {
    try {
        const dataBuffer = require('fs').readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF.');
    }
}

module.exports = { extractTextFromPdf };
