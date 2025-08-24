import React from 'react';
import './SearchFilter.css';

const SearchFilter = ({ 
  categories, 
  searchQuery, 
  selectedCategory, 
  availabilityFilter, 
  onSearch, 
  onFilter 
}) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    onFilter({ category, availability: availabilityFilter });
  };

  const handleAvailabilityChange = (e) => {
    const availability = e.target.value;
    onFilter({ category: selectedCategory, availability });
  };

  return (
    <div className="search-filter">
      <div className="search-section">
        <h3 className="search-label">Search Plants</h3>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search plants by name or description..."
            value={searchQuery || ''}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory || 'All Categories'}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="All Categories">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Availability</label>
          <select
            value={availabilityFilter || 'all'}
            onChange={handleAvailabilityChange}
            className="filter-select"
          >
            <option value="all">All Plants</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <div className="filter-group">
          <button 
            className="filter-reset-btn"
            onClick={() => {
              onSearch('');
              onFilter({ category: 'All Categories', availability: 'all' });
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
