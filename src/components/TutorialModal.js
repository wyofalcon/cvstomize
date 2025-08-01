import React from 'react';

const TutorialModal = ({ setIsOpen }) => {
  return (
    // The modal-overlay is a semi-transparent background
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      {/* We use stopPropagation to prevent a click inside the content from closing the modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Use CVstomize</h2>
          <button className="close-button" onClick={() => setIsOpen(false)}>X</button>
        </div>
        <div className="modal-body">
          <p>Follow these simple steps to craft the perfect resume:</p>
          <ol>
            <li>
              <strong>Upload Your Documents:</strong> Start by uploading your current resume, cover letters, or any other relevant documents. The more information you provide, the better the result.
            </li>
            <li>
              <strong>Add Personal Stories (The Secret Weapon):</strong> This is the step most people miss when building a resume. Think about projects or experiences, even non-work related ones, where you learned a skill. These personal stories are fantastic ways to share skills you didn't even realize you could put on your resume—skills that could help your odds of landing that job interview. Don't be shy!
            </li>
            <li>
              <strong>Paste the Job Description:</strong> Copy the entire job description from the company's listing and paste it into the third box. This allows the AI to tailor your resume directly to the employer's needs.
            </li>
            <li>
              <strong>Choose Your Sections:</strong> Select the resume sections you want to appear in the final document. We've pre-selected the most common ones for you.
            </li>
            <li>
              <strong>Generate & Download:</strong> Click the "Generate My CV" button. Review the result and, when you're happy, download it as a PDF.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
