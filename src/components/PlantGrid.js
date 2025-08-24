import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import CustomDropdown from './CustomDropdown';
import PlantCard from './PlantCard';
import LoadingSpinner from './LoadingSpinner';
import './PlantGrid.css';

const PlantGrid = ({ 
  plants, 
  searchQuery, 
  selectedCategory, 
  onSearch, 
  onCategoryChange, 
  categories,
  loading,
  error 
}) => {
  const { theme, isDark } = useTheme();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory || 'All Categories');
  const [sortBy, setSortBy] = useState('Newest First');

  // Sort options with descriptive labels
  const sortOptions = [
    'Newest First',
    'Name A-Z',
    'Price Low to High',
    'Price High to Low',
    'Most Popular',
    'Best Rating'
  ];

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    setLocalSelectedCategory(selectedCategory || 'All Categories');
  }, [selectedCategory]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    onSearch?.(query);
  };

  const handleCategoryChange = (category) => {
    setLocalSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    setLocalSelectedCategory('All Categories');
    setSortBy('Newest First');
    onSearch?.('');
    onCategoryChange?.('All Categories');
  };

  // Enhanced sorting logic
  const sortedPlants = [...plants].sort((a, b) => {
    switch (sortBy) {
      case 'Price Low to High':
        return a.price - b.price;
      case 'Price High to Low':
        return b.price - a.price;
      case 'Name A-Z':
        return a.name.localeCompare(b.name);
      case 'Most Popular':
        // Sort by availability and stock count
        if (a.availability !== b.availability) {
          return b.availability - a.availability;
        }
        return (b.stockCount || 0) - (a.stockCount || 0);
      case 'Best Rating':
        // Sort by rating (assuming you have a rating field)
        return (b.rating || 0) - (a.rating || 0);
      case 'Newest First':
      default:
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    }
  });

  if (loading) {
    return (
      <div className="plant-grid-loading">
        <LoadingSpinner />
        <p>Loading plants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plant-grid-error">
        <p>Error loading plants: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <section id="plants-section" className={`plant-grid-section ${theme}`}>
      <div className="plant-grid-container">
        {/* Enhanced Search and Filter Section */}
        <div className="search-filter-card">
          <div className="search-filter-grid">
            {/* Search Input */}
            <div className="search-input-group">
              <div className="search-input-wrapper">
                <svg 
                  className="search-icon" 
                  width="20" 
                  height="20" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {localSearchQuery && (
                  <button
                    onClick={() => handleSearchChange({ target: { value: '' } })}
                    className="search-clear-btn"
                    type="button"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="category-select-group">
              <CustomDropdown
                label="Category"
                value={localSelectedCategory}
                onChange={handleCategoryChange}
                options={['All Categories', ...categories]}
                placeholder="Select a category"
                className="category-dropdown"
              />
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="clear-filters-btn"
              type="button"
              disabled={!localSearchQuery && localSelectedCategory === 'All Categories' && sortBy === 'Newest First'}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18"/>
                <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Header with Enhanced Sort Dropdown */}
        <div className="results-header">
          <div className="results-info">
            <h2 className="section-title gradient-text">Featured Plants</h2>
            <p className="results-count">
              {sortedPlants.length} plant{sortedPlants.length !== 1 ? 's' : ''} found
              {(localSearchQuery || localSelectedCategory !== 'All Categories') && (
                <span className="filter-indicator">
                  {localSearchQuery && ` • "${localSearchQuery}"`}
                  {localSelectedCategory !== 'All Categories' && ` • ${localSelectedCategory}`}
                </span>
              )}
            </p>
          </div>
          
          <div className="sort-controls">
            <CustomDropdown
              label="Sort by:"
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              placeholder="Choose sorting"
              className="sort-dropdown"
            />
          </div>
        </div>

        {/* Plants Grid */}
        {sortedPlants.length > 0 ? (
          <>
            {/* Quick Stats Bar */}
            <div className="quick-stats">
              <div className="stat-item">
                {/* <span className="stat-icon">🌱</span> */}
                {/* <span className="stat-text">{sortedPlants.length} Total</span> */}
              </div>
              <div className="stat-item">
                {/* <span className="stat-icon">✅</span>
                <span className="stat-text">
                  {sortedPlants.filter(p => p.availability).length} Available
                </span> */}
              </div>
              {/* <div className="stat-item">
                <span className="stat-icon">💰</span>
                <span className="stat-text">
                  ₹{Math.min(...sortedPlants.map(p => p.price))} - 
                  ₹{Math.max(...sortedPlants.map(p => p.price))}
                </span>
              </div> */}
            </div>

            <div className="plants-grid">
              {sortedPlants.map((plant, index) => (
                <div 
                  key={plant._id}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease forwards'
                  }}
                >
                  <PlantCard plant={plant} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-plants">
            <div className="no-plants-content">
              <div className="no-plants-icon">🔍</div>
              <h3>No plants found</h3>
              <p>
                {localSearchQuery || localSelectedCategory !== 'All Categories'
                  ? `No plants match your current filters. Try adjusting your search criteria.`
                  : "No plants are available at the moment. Check back soon for new arrivals!"
                }
              </p>
              {(localSearchQuery || localSelectedCategory !== 'All Categories' || sortBy !== 'Newest First') && (
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlantGrid;
