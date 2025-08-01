import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';
import { Document } from 'docx';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.js'; // Using the 'legacy' build as requested by the warning

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = async (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({}); // This will now work correctly with the 'import' syntax
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        const singleFields = {};
        for (const key in fields) {
          singleFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        }
        const singleFiles = {};
        for (const key in files) {
            singleFiles[key] = Array.isArray(files[key]) ? files[key] : [files[key]];
        }
        resolve({ fields: singleFields, files: singleFiles });
      }
    });
  });
};

const extractTextFromFile = async (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    try {
      const dataBuffer = fs.readFileSync(filePath);

      if (extension === 'pdf') {
        const data = new Uint8Array(dataBuffer);
        // The legacy build of pdfjs does not require a worker to be set manually in Node.js
        const doc = await pdfjs.getDocument(data).promise;
        let text = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(' ') + '\n';
        }
        return text;
      } else if (extension === 'docx') {
        const doc = await Document.load(dataBuffer);
        let text = '';
        doc.getParagraphs().forEach(p => {
            text += p.getText() + '\n';
        });
        return text;
      } else {
        return dataBuffer.toString('utf-8');
      }
    } catch (error) {
      console.error(`Error extracting text from ${filePath}:`, error);
      return '';
    }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseFormData(req);
    const { personalStories, jobDescription, selectedSections: sectionsString } = fields;
    const documents = files.documents || [];
    
    const selectedSections = sectionsString ? sectionsString.split(',') : [];

    if (documents.length === 0 || !jobDescription || selectedSections.length === 0) {
      return res.status(400).json({ error: 'Resume, job description, and at least one section are required.' });
    }

    let originalCvText = '';
    for (const file of documents) {
      const text = await extractTextFromFile(file.filepath);
      originalCvText += text + '\n\n---\n\n';
      fs.unlinkSync(file.filepath);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      You are an elite-level professional resume writer and career strategist. Your task is to act as a personal hiring consultant for the user.
      **PRIMARY DIRECTIVE:**
      Analyze the provided job posting. If necessary, use your external knowledge to understand the nuances of the role and the company's industry to determine what a top-tier candidate profile looks like. Your goal is to craft a clean, professional, and easy-to-read resume that makes the user the most compelling candidate possible.
      **INPUTS:**
      1.  \`<ORIGINAL_RESUME_TEXT>\`: Raw text from the user's documents.
      2.  \`<PERSONAL_STORIES>\`: Additional context, projects, or skills provided by the user. This is often where the most valuable, unique qualifications are hidden.
      3.  \`<JOB_DESCRIPTION>\`: The target job.
      4.  \`<SECTIONS_TO_INCLUDE>\`: The specific resume sections the user has requested.
      **CRITICAL RULES OF EXECUTION:**
      1.  **Cherry-Pick Excellence:** Scrutinize all inputs. Your job is to "cherry-pick" only the most relevant and impactful skills, work history, and project details that directly align with the job description.
      2.  **No Filler, No Repetition:** The final resume must be concise. Do not repeat information. Do not add "filler" language. Every word should serve a purpose.
      3.  **No Exaggeration:** You must not exaggerate or invent qualifications. Your role is to frame the user's existing skills and experience in the most professional and effective light possible.
      4.  **Strict Formatting:** The output MUST be clean, structured Markdown. This is not optional. Use '#' for the name, '##' for section headers (e.g., "## Professional Experience"), and '*' for bullet points. Do not add any other formatting.
      5.  **Strict Section Adherence:** You MUST only generate the sections listed in \`<SECTIONS_TO_INCLUDE>\`. Do not add, remove, or rename sections.
      6.  **No Commentary:** Do not include any explanations, introductions, or concluding remarks in your output. The response must begin directly with the candidate's name.
      ---
      **BEGIN INPUTS**
      ---
      <ORIGINAL_RESUME_TEXT>
      ${originalCvText}
      </ORIGINAL_RESUME_TEXT>
      <PERSONAL_STORIES>
      ${personalStories}
      </PERSONAL_STORIES>
      <JOB_DESCRIPTION>
      ${jobDescription}
      </JOB_DESCRIPTION>
      <SECTIONS_TO_INCLUDE>
      ${selectedSections.join('\n')}
      </SECTIONS_TO_INCLUDE>
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    res.status(200).json({ generatedCv: generatedText });

  } catch (error) {
    console.error('Error in /api/generate-cv:', error);
    res.status(500).json({ error: 'An internal server error occurred while generating the CV.' });
  }
}
