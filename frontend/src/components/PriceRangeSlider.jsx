import React, { useState, useEffect, useRef } from 'react';

const PriceRangeSlider = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(400);
  const minGap = 10;
  const rangeRef = useRef(null);

  const handleMinChange = (e) => {
    const value = Math.min(parseInt(e.target.value), max - minGap);
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(parseInt(e.target.value), min + minGap);
    setMax(value);
  };

  useEffect(() => {
    const minPercent = (min / 400) * 100;
    const maxPercent = (max / 400) * 100;
    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.right = `${100 - maxPercent}%`;
    }
  }, [min, max]);

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">PRICE RANGE</h2>

        <div className="relative mt-4 slider-container" style={{ height: '18px' }}>
          <input
            type="range"
            min="0"
            max="400"
            value={min}
            onChange={handleMinChange}
            className="range-input"
          />
          <input
            type="range"
            min="0"
            max="400"
            value={max}
            onChange={handleMaxChange}
            className="range-input"
          />

          <div className="relative w-full h-2 bg-gray-200 rounded-md">
            <div
              ref={rangeRef}
              className="absolute h-2 bg-gradient-to-r from-blue-900 to-blue-400 rounded-md"
            ></div>
          </div>
        </div>

        <div className="flex justify-between mt-3 text-gray-600">
          <span>Min Price: ${min}</span>
          <span>Max Price: ${max}</span>
        </div>

        <style jsx>{`
          .range-input {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            position: absolute;
            background: transparent;
            pointer-events: none;
            z-index: 2;
          }

          .range-input::-webkit-slider-runnable-track {
            height: 2px;
          }

          .range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: white;
            border: 3px solid #23a9f7;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            position: relative;
            z-index: 3;
            transform: translateY(-30%);
          }

          .range-input::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: white;
            border: 3px solid #23a9f7;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            z-index: 3;
            transform: translateY(-30%);
          }
        `}</style>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
