import React from 'react';
import './Slider.css';

/**
 * Componente Slider
 */
const Slider = ({ label, value, onChange, min = 0, max = 100, step = 5 }) => {
  return (
    <div className="sliderFormGroup">
      <label className="sliderLabel">{label}</label>
      <div className="sliderContainer">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="sliderInput"
        />
        <span className="sliderValue">{value}%</span>
      </div>
    </div>
  );
};

export default Slider;