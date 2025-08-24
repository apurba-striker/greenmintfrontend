import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './CustomDropdown.css';

const CustomDropdown = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { isDark } = useTheme();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRef = useRef([]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleOptionClick(filteredOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, focusedIndex]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [focusedIndex]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1);
  };

  const getDisplayValue = () => {
    if (value && value !== 'All Categories') {
      return value;
    }
    return placeholder;
  };

  return (
    <div className={`custom-dropdown ${className} ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      {label && (
        <label className="dropdown-label">{label}</label>
      )}
      
      <div className="dropdown-container">
        <button
          type="button"
          className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="dropdown-value">
            {getDisplayValue()}
          </span>
          <svg 
            className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
          <div className="dropdown-search">
            <svg 
              className="search-icon" 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="dropdown-options" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option}
                  ref={el => optionsRef.current[index] = el}
                  className={`dropdown-option ${
                    option === value ? 'selected' : ''
                  } ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={option === value}
                >
                  <span className="option-text">{option}</span>
                  {option === value && (
                    <svg 
                      className="check-icon" 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="no-options">
                <span>No categories found</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
