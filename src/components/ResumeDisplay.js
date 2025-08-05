import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const ResumeDisplay = ({ title, content, isLoading, selectedStyle }) => {
  const resumeClassName = `resume-style-${selectedStyle.toLowerCase()}`;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (content && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pageHeight = 1056; // 8.5in * 96dpi = 816px, 11in * 96dpi = 1056px
      const numPages = Math.ceil(contentHeight / pageHeight);
      const newPages = [];
      for (let i = 0; i < numPages; i++) {
        newPages.push(i);
      }
      setPages(newPages);
    }
  }, [content]);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="card full-height">
      <h2>4. Your Custom-Crafted CV</h2>
      <div className="resume-output">
        {isLoading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Generating your CV...</p>
          </div>
        )}
        {!isLoading && !content && (
          <p className="placeholder-text">Your generated resume will appear here.</p>
        )}
        {content && (
          <div
            id="resume-content"
            className={resumeClassName}
            style={{ 
              transform: window.matchMedia && window.matchMedia('print').matches 
                ? 'none' 
                : `translateY(-${currentPage * 1056}px)` 
            }}
            ref={contentRef}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
      {pages.length > 1 && (
        <div className="page-controls">
          <button onClick={goToPrevPage}>Previous Page</button>
          <span>Page {currentPage + 1} of {pages.length}</span>
          <button onClick={goToNextPage}>Next Page</button>
        </div>
      )}
    </div>
  );
};

export default ResumeDisplay;
