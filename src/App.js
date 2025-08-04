import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FileUpload from './components/FileUpload';
import TextInput from './components/TextInput';
import ResumeDisplay from './components/ResumeDisplay';
import SectionSelector from './components/SectionSelector';
import TutorialModal from './components/TutorialModal';
import StyleSelector from './components/StyleSelector'; // Import the new component
import './App.css';

const ALL_SECTIONS = [
  'Contact Information', 'Professional Summary or Objective Statement', 'Core Competencies / Key Skills',
  'Professional Experience (Work History)', 'Education', 'Certifications & Licenses', 'Major Projects or Portfolio Highlights',
  'Technical Skills (Tools, Technologies, Platforms)', 'Research Experience (Academic/Industry)', 'Publications & Presentations',
  'Awards & Honors', 'Professional Affiliations & Memberships', 'Volunteer Experience & Community Involvement',
  'Conferences, Workshops & Continuing Education', 'Patents & Intellectual Property', 'Language Proficiency',
  'Leadership & Extracurricular Activities', 'Interests & Hobbies (if relevant to role or culture)',
  'References (Available Upon Request)', 'Additional Information (Security Clearances, Visa Status, etc.)'
];

const RECOMMENDED_SECTIONS = [
  'Contact Information', 'Professional Summary or Objective Statement', 'Core Competencies / Key Skills',
  'Professional Experience (Work History)', 'Education'
];

function App() {
  const [files, setFiles] = useState([]);
  const [personalStories, setPersonalStories] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedCv, setGeneratedCv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSections, setSelectedSections] = useState(RECOMMENDED_SECTIONS);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('Modern'); // State for the resume style

  const handleGenerate = async () => {
    if (files.length === 0 || !jobDescription || selectedSections.length === 0) {
      setError('Please upload a document, provide a job description, and select at least one section.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setGeneratedCv('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });
    formData.append('personalStories', personalStories);
    formData.append('jobDescription', jobDescription);
    formData.append('selectedSections', selectedSections.join(','));

    try {
      const response = await axios.post('/api/generate-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setGeneratedCv(response.data.generatedCv);
    } catch (err) {
      console.error("An error occurred during CV generation:", err);
      setError("An error occurred while generating the CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedCv) return;

    const resumeElement = document.getElementById('resume-content');

    html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // If you have images from other domains
      logging: true, 
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      // If the height is greater than the PDF page height, you might need to split it
      // For simplicity, this example scales it to fit. 
      let finalHeight = height;
      if (height > pdfHeight) {
        console.warn("Content is taller than the page, scaling to fit.");
        finalHeight = pdfHeight;
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
      pdf.save('CVstomize_Resume.pdf');
    }).catch(err => {
      console.error("Error creating PDF: ", err);
      setError("Could not generate PDF. Please try a different style or contact support.");
    });
  };

  return (
    <div className="App">
      {isTutorialOpen && <TutorialModal setIsOpen={setIsTutorialOpen} />}

      <header className="App-header">
        <h1>Don't just apply, <span>CVstomize</span></h1>
        <button className="tutorial-btn" onClick={() => setIsTutorialOpen(true)}>
          How to Use
        </button>
      </header>
      <main className="App-main">
        <div className="input-column">
          <FileUpload files={files} setFiles={setFiles} />
          <TextInput
            title="2. Add Personal Stories"
            placeholder="Add any relevant experiences, projects, or achievements..."
            value={personalStories}
            onChange={(e) => setPersonalStories(e.target.value)}
          />
          <TextInput
            title="3. Paste Job Description"
            placeholder="Paste the entire job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <div className="output-column">
          <ResumeDisplay
            title="4. Your Custom-Crafted CV"
            content={generatedCv}
            isLoading={isLoading}
            selectedStyle={selectedStyle} 
          />
          <SectionSelector
            allSections={ALL_SECTIONS}
            recommendedSections={RECOMMENDED_SECTIONS}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
          />
          <StyleSelector
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
          />
        </div>
      </main>
      <footer className="App-footer">
        <button className="generate-btn" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate My CV'}
        </button>
        {generatedCv && !isLoading && (
          <button className="download-btn" onClick={handleDownload}>
            Download as PDF
          </button>
        )}
      </footer>
       {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;
