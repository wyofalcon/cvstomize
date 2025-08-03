let originalCvText = '';
for (const file of documents) {
  const text = await extractTextFromFile(file.filepath);
  originalCvText += text + '\n\n---\n\n';
  fs.unlinkSync(file.filepath);
}
console.log('Extracted CV text:', originalCvText); // <-- Add this line

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = `
  ...your prompt...
`;

console.log('Prompt sent to Gemini:', prompt); // <-- Optionally add this line