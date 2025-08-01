import React from 'react';

const TextInput = ({ title, placeholder, value, onChange }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default TextInput;