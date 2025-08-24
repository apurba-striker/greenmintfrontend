import React, { useState, useEffect } from 'react';
import './Banner.css';
import plant from "../pexels-juanpphotoandvideo-1084188.jpg"


const Banner = ({ onSearch, onCategoryFilter, categories = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Popular search suggestions
  const searchSuggestions = [
    'Indoor plants', 'Low light plants', 'Air purifying plants', 
    'Succulents', 'Flowering plants', 'Easy care plants'
  ];

  // Popular plant tags
  const plantTags = [
    { name: 'Indoor', icon: '🏠', color: 'blue' },
    { name: 'Outdoor', icon: '🌞', color: 'orange' },
    { name: 'Succulent', icon: '🌵', color: 'green' },
    { name: 'Air Purifying', icon: '💨', color: 'cyan' },
    { name: 'Low Light', icon: '🌙', color: 'purple' },
    { name: 'Pet Friendly', icon: '🐕', color: 'pink' },
    { name: 'Easy Care', icon: '💧', color: 'teal' },
    { name: 'Flowering', icon: '🌸', color: 'rose' }
  ];

  const stats = [
    { number: "50+", label: "Plant Species", icon: "🌱" },
    { number: "100+", label: "Happy Customers", icon: "😊" },
    { number: "24/7", label: "Plant Care Support", icon: "💚" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setShowSearchSuggestions(false);
      // Scroll to plants section
      document.getElementById('plants-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    onSearch?.(suggestion);
    document.getElementById('plants-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag.name)) {
      const newTags = selectedTags.filter(t => t !== tag.name);
      setSelectedTags(newTags);
      onCategoryFilter?.(newTags.length > 0 ? newTags[0] : 'All Categories');
    } else {
      const newTags = [...selectedTags, tag.name];
      setSelectedTags(newTags);
      onCategoryFilter?.(tag.name);
    }
    document.getElementById('plants-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleExploreClick = () => {
    document.getElementById('plants-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="modern-hero-banner">
      {/* Animated Background */}
      <div className="banner-background">
        <div className="background-gradient"></div>
        <div className="floating-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>

      <div className="banner-container">
        <div className="banner-content">
          {/* Left Content */}
          <div className={`content-left ${isVisible ? 'animate-in' : ''}`}>
            {/* Badge */}
            <div className="badge-container">
              <span className="new-badge">
                <span className="badge-icon">✨</span>
                New Collection Available
              </span>
            </div>

            {/* Title */}
            <h1 className="hero-title">
              <span className="title-line">Buy your</span>
              <span className="title-highlight">dream plants</span>
            </h1>

            <p className="hero-description">
              Transform your space into a green paradise with our carefully 
              curated collection of beautiful, healthy plants. Expert care 
              tips included with every purchase.
            </p>

            {/* Stats - Desktop */}
            <div className="stats-container desktop-stats">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="stat-item"
                  style={{ animationDelay: `${0.5 + index * 0.2}s` }}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="stat-info">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="search-container">

              
              {/* Plant Tags */}
            </div>

            {/* CTA Buttons */}
    
          </div>

          {/* Right Content - Plant Image */}
          <div className={`content-right ${isVisible ? 'animate-in' : ''}`}>
            <div className="plant-showcase">
              <div className="main-plant-container">
                <div className="plant-image-wrapper">
                  <div className="plant-glow"></div>
                  <img 
                    src={plant}
                    alt="Beautiful plant collection"
                    className="main-plant-image"
                  />
                  
                  {/* Floating Info Cards */}
                  {/* <div className="floating-card card-1">
                    <div className="card-icon">💧</div>
                    <div className="card-text">
                      <span>Easy Care</span>
                      <small>Water weekly</small>
                    </div>
                  </div>
                  
                  <div className="floating-card card-2">
                    <div className="card-icon">☀️</div>
                    <div className="card-text">
                      <span>Bright Light</span>
                      <small>Indirect sunlight</small>
                    </div>
                  </div>
                  
                  <div className="floating-card card-3">
                    <div className="card-icon">🌱</div>
                    <div className="card-text">
                      <span>Fast Growing</span>
                      <small>3-6 months</small>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          {/* <div className="stats-container mobile-stats">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="stat-item"
                style={{ animationDelay: `${0.5 + index * 0.2}s` }}
              >
                <span className="stat-icon">{stat.icon}</span>
                <div className="stat-info">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Banner;
