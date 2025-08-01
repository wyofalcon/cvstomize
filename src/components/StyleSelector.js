import React from 'react';

const STYLES = ['Modern', 'Classic', 'Technical'];

const StyleSelector = ({ selectedStyle, setSelectedStyle }) => {
  return (
    <div className="card">
      <h2>6. Choose a Style</h2>
      <div className="style-selector-container">
        {STYLES.map(style => (
          <button
            key={style}
            className={`style-btn ${selectedStyle === style ? 'active' : ''}`}
            onClick={() => setSelectedStyle(style)}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
