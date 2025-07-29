import { useState, useRef, useEffect } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const MultiSelectDropdown = ({ label, options, disOptions, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);  // Reference for the dropdown

  const toggleOption = (option, e) => {
    e.stopPropagation();  // Prevent the event from bubbling up and closing the dropdown
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const isSelected = (option) => selected.includes(option);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        zIndex: 9999,
        width: '10.5rem',
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !buttonRef.current?.contains(e.target) && // Button clicked outside
        !dropdownRef.current?.contains(e.target) // Clicked outside dropdown
      ) {
        setIsOpen(false); // Close dropdown
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-1 border capitalize border-neutral-300 dark:border-neutral-700 rounded-full py-1 px-3 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-900 whitespace-nowrap"
      >
        {label}
        <LuChevronDown />
      </button>

      {isOpen && (
        <ul
          ref={dropdownRef}
          className="bg-white dark:bg-dtc border border-neutral-300 dark:border-neutral-700 rounded-md shadow-lg text-sm"
          style={dropdownStyle}
        >
          {options.map((opt, i) => (
            <li
              key={i}
              className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
              onClick={(e) => toggleOption(opt, e)} // Pass event to stop propagation
            >
              <input
                type="checkbox"
                checked={isSelected(opt)}
                onChange={() => {}}
                className="accent-green-600 cursor-pointer"
              />
              <span>{disOptions[i]}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MultiSelectDropdown;
