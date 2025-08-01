import React from 'react';

// This is a simplified version using a standard HTML file input
// to bypass the 'react-dropzone' library error.

const FileUpload = ({ files, setFiles }) => {
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="card">
      <h2>1. Upload Your Documents</h2>

      {/* This standard input replaces the dropzone component */}
      <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
          <p>Click the button below to select your files.</p>
          <input type="file" multiple onChange={handleFileChange} style={{marginTop: '10px'}} />
          <em style={{display: 'block', marginTop: '10px'}}>(PDF or DOCX)</em>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h4>Selected files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name}
                <button onClick={() => removeFile(file.name)}>X</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;