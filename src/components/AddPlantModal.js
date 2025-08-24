import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './AddPlantForm.css';

const AddPlantModal = ({ isOpen, onClose, onSubmit, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stockCount: '',
    availability: true,
    categories: [],
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFormData(prev => {
      const currentCategories = prev.categories || [];
      const updatedCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      
      return { ...prev, categories: updatedCategories };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plant name is required';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.stockCount || isNaN(formData.stockCount) || parseInt(formData.stockCount) < 0) {
      newErrors.stockCount = 'Valid stock count is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('price', parseFloat(formData.price));
      submitData.append('description', formData.description.trim());
      submitData.append('stockCount', parseInt(formData.stockCount));
      submitData.append('availability', formData.availability);
      submitData.append('categories', JSON.stringify(formData.categories));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to add plant. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      stockCount: '',
      availability: true,
      categories: [],
      image: null
    });
    setImagePreview(null);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-plant-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add New Plant</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="modal-content">
          {/* Image Upload Section */}
          <div className="form-section">
            <h3 className="section-title">Plant Image</h3>
            <div className="image-upload-area">
              <input
                type="file"
                id="plant-image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="plant-image" className="image-upload-label">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Plant preview" />
                    <div className="image-overlay">
                      <span>Click to change image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">
                      <p>Click to upload plant image</p>
                      <small>PNG, JPG up to 5MB</small>
                    </div>
                  </div>
                )}
              </label>
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="plant-name">Plant Name *</label>
                <input
                  type="text"
                  id="plant-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Snake Plant"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="plant-price">Price (₹) *</label>
                <input
                  type="number"
                  id="plant-price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="299"
                  min="0"
                  step="0.01"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock-count">Stock Count *</label>
                <input
                  type="number"
                  id="stock-count"
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleInputChange}
                  placeholder="50"
                  min="0"
                  className={`form-input ${errors.stockCount ? 'error' : ''}`}
                />
                {errors.stockCount && <span className="error-message">{errors.stockCount}</span>}
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  className="checkbox"
                />
                <label htmlFor="availability" className="checkbox-label">
                  Available for sale
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3 className="section-title">Description</h3>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the plant, care instructions, benefits..."
                rows="4"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* Categories */}
          <div className="form-section">
            <h3 className="section-title">Categories</h3>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  className={`category-tag ${formData.categories.includes(category) ? 'selected' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding Plant...
                </>
              ) : (
                'Add Plant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddPlantModal;
