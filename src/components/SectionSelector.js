import React from 'react';

const SectionSelector = ({ allSections, recommendedSections, selectedSections, setSelectedSections }) => {
  const handleSelectionChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedSections(prev => [...prev, name]);
    } else {
      setSelectedSections(prev => prev.filter(section => section !== name));
    }
  };

  return (
    <div className="card">
      <h2>5. Choose Your Resume Sections</h2>
      <div className="section-selector-list">
        {allSections.map(section => (
          <div key={section} className="section-item">
            <input
              type="checkbox"
              id={section}
              name={section}
              checked={selectedSections.includes(section)}
              onChange={handleSelectionChange}
            />
            <label htmlFor={section}>{section}</label>
            {recommendedSections.includes(section) && (
              <span className="recommended-badge">Recommended</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionSelector;