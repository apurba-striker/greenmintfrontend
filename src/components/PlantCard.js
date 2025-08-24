import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
  const { addToCart, getItemQuantity, updateQuantity, isInCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!plant) return null;

  const plantName = plant.name || 'Unknown Plant';
  const plantPrice = plant.price || 0;
  const plantDescription = plant.description || '';
  const plantCategories = Array.isArray(plant.categories) ? plant.categories : [];
  const plantAvailability = Boolean(plant.availability);

  const quantity = getItemQuantity(plant._id) || 0;
  const inCart = isInCart(plant._id);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `http://localhost:5000${imagePath}`;
    if (imagePath.includes('uploads/')) return `http://localhost:5000/${imagePath}`;
    return null;
  };

  const imageUrl = getImageUrl(plant.image);

  const handleAddToCart = () => {
    if (!plantAvailability) return;
    try {
      addToCart(plant);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    try {
      updateQuantity(plant._id, Math.max(0, newQuantity));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <article className="plant-card">
      {/* Image Section */}
      <div className="plant-image-container">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={plantName}
            className={`plant-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="plant-image-placeholder">
            <span className="placeholder-letter">
              {plantName.charAt(0).toUpperCase()}
            </span>
            <span className="placeholder-name">{plantName}</span>
          </div>
        )}
        
        {/* Success Animation */}
        {showSuccess && (
          <div className="success-overlay">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <span>Added to Cart!</span>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className={`availability-badge ${plantAvailability ? 'in-stock' : 'out-of-stock'}`}>
          {plantAvailability ? 'In Stock' : 'Out of Stock'}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" title="Add to wishlist">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="quick-action-btn" title="Share">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="plant-content">
        {/* Header */}
        <div className="plant-header">
          <h3 className="plant-name">{plantName}</h3>
          <div className="plant-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= 4 ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-count">(4.8)</span>
          </div>
        </div>

        {/* Description */}
        <p className="plant-description">
          {plantDescription || 'Beautiful plant perfect for your home and garden.'}
        </p>

        {/* Categories */}
        {plantCategories.length > 0 && (
          <div className="plant-categories">
            {plantCategories.slice(0, 3).map((category, index) => (
              <span key={`${category}-${index}`} className="category-tag">
                {category}
              </span>
            ))}
            {plantCategories.length > 3 && (
              <span className="category-tag more">
                +{plantCategories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="plant-footer">
          <div className="price-section">
            <span className="price">₹{plantPrice.toLocaleString()}</span>
            <span className="price-unit">per plant</span>
          </div>

          {!inCart ? (
            <button
              onClick={handleAddToCart}
              disabled={!plantAvailability}
              className={`add-to-cart-btn ${plantAvailability ? 'available' : 'unavailable'}`}
            >
              {plantAvailability ? 'Add to Cart' : 'Out of Stock'}
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="quantity-btn"
                disabled={quantity <= 0}
              >
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PlantCard;
