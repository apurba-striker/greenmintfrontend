import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './AdminDashboard.css';

const AdminDashboard = ({ plants, isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const { items: cartItems, getCartTotal } = useCart();
  const [stats, setStats] = useState({
    totalPlants: 0,
    inStock: 0,
    outOfStock: 0,
    totalRevenue: 0,
    orders: 0
  });

  useEffect(() => {
    if (plants) {
      const totalPlants = plants.length;
      const inStock = plants.filter(p => p.availability).length;
      const outOfStock = totalPlants - inStock;
      const totalRevenue = plants.reduce((sum, plant) => sum + plant.price, 0);

      setStats({
        totalPlants,
        inStock,
        outOfStock,
        totalRevenue,
        orders: cartItems.length
      });
    }
  }, [plants, cartItems]);

  if (!isAdmin()) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <div className="admin-dashboard-backdrop" onClick={onClose}>
      <div className="admin-dashboard" onClick={e => e.stopPropagation()}>
        <div className="dashboard-header">
          <div className="header-info">
            <h2>Admin Dashboard</h2>
            <p>Welcome back, {user?.username}!</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={logout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
            <button className="close-dashboard-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon plants">🌱</div>
              <div className="stat-info">
                <h3>{stats.totalPlants}</h3>
                <p>Total Plants</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon in-stock">✅</div>
              <div className="stat-info">
                <h3>{stats.inStock}</h3>
                <p>In Stock</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon out-stock">❌</div>
              <div className="stat-info">
                <h3>{stats.outOfStock}</h3>
                <p>Out of Stock</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">💰</div>
              <div className="stat-info">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Recent Plants */}
          <div className="dashboard-section">
            <h3>Recent Plants</h3>
            <div className="plants-table">
              <div className="table-header">
                <span>Name</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
              </div>
              {plants.slice(0, 5).map(plant => (
                <div key={plant._id} className="table-row">
                  <span className="plant-name">{plant.name}</span>
                  <span className="plant-price">₹{plant.price}</span>
                  <span className="plant-stock">{plant.stockCount}</span>
                  <span className={`plant-status ${plant.availability ? 'available' : 'unavailable'}`}>
                    {plant.availability ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New Plant
              </button>
              <button className="action-btn secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Manage Categories
              </button>
              <button className="action-btn secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
