import { useState } from 'react';
import clsx from 'clsx';

const Slider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  value, 
  onChange, 
  label,
  showValue = true 
}) => {
  const [localValue, setLocalValue] = useState(value || min);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <span className="text-sm text-gray-600">{localValue}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Slider;