// src/components/CartSidebar.js
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  // Helper function to get proper image URL (same as in PlantCard)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct full URL
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Handle case where path doesn't start with /
    if (imagePath.includes('uploads/') && !imagePath.startsWith('/')) {
      return `http://localhost:5000/${imagePath}`;
    }
    
    // If it's a data URL (SVG), return as is
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    return null;
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some beautiful plants to get started!</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => {
                  const imageUrl = getImageUrl(item.image);
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        {imageUrl ? (
                          imageUrl.startsWith('data:') ? (
                            <div 
                              className="item-svg-image"
                              dangerouslySetInnerHTML={{ __html: decodeURIComponent(imageUrl.split(',')[1]) }}
                            />
                          ) : (
                            <img 
                              src={imageUrl} 
                              alt={item.name}
                              onError={(e) => {
                                console.error('Failed to load cart image:', imageUrl);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                              onLoad={() => console.log('Cart image loaded:', imageUrl)}
                            />
                          )
                        ) : null}
                        
                        {/* Fallback placeholder */}
                        <div className="cart-image-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
                          <span>🌱</span>
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-categories">
                          {item.categories && item.categories.slice(0, 2).map(category => (
                            <span key={category} className="item-category">{category}</span>
                          ))}
                        </div>
                        <div className="item-price">₹{item.price.toLocaleString()}</div>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19"/>
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                        </div>
                        
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
