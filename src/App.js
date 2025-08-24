import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import PlantGrid from './components/PlantGrid';
import AddPlantModal from './components/AddPlantModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Banner from './components/Banner';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const DEFAULT_CATEGORIES = [
  'Indoor', 'Outdoor', 'Succulent', 'Air Purifying', 
  'Home Decor', 'Low Maintenance', 'Flowering', 'Medicinal'
];

function AppContent() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Create axios instance with increased timeout
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Increased to 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add response interceptor for better error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - server may be slow');
        return Promise.reject(new Error('Request timeout. Server is taking too long to respond.'));
      }
      if (error.response?.status === 404) {
        return Promise.reject(new Error('API endpoint not found. Check your server URL.'));
      }
      if (error.response?.status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
      return Promise.reject(error);
    }
  );

  // Simplified fetch plants function
  const fetchPlants = useCallback(async (filters = {}) => {
    try {
      console.log('🌱 Fetching plants...');
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }
      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }

      const endpoint = `/plants${params.toString() ? `?${params.toString()}` : ''}`;
      console.log(`📡 Making request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await apiClient.get(endpoint);
      console.log('✅ Response received:', response.status);

      if (response.data && response.data.success) {
        const plantsData = Array.isArray(response.data.data) ? response.data.data : [];
        console.log(`📊 Plants data length: ${plantsData.length}`);
        
        // Sanitize plant data
        const sanitizedPlants = plantsData.map(plant => ({
          _id: plant._id || `temp-${Date.now()}-${Math.random()}`,
          name: plant.name || 'Unknown Plant',
          price: Number(plant.price) || 0,
          description: plant.description || '',
          categories: Array.isArray(plant.categories) ? plant.categories : [],
          availability: Boolean(plant.availability),
          stockCount: Number(plant.stockCount) || 0,
          image: plant.image || '',
          createdAt: plant.createdAt || new Date().toISOString(),
          updatedAt: plant.updatedAt || new Date().toISOString()
        }));

        setPlants(sanitizedPlants);
        console.log(`✅ Successfully loaded ${sanitizedPlants.length} plants`);
      } else {
        throw new Error(response.data?.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching plants:', err);
      const errorMessage = err.message || 'Failed to fetch plants';
      setError(errorMessage);
      
      // Don't clear existing plants on error
      if (plants.length === 0) {
        setPlants([]);
      }
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  // Fetch categories with better error handling
  const fetchCategories = useCallback(async () => {
    try {
      console.log('📂 Fetching categories...');
      const response = await apiClient.get('/categories');

      if (response.data && response.data.success) {
        const categoriesData = Array.isArray(response.data.data) ? response.data.data : [];
        const validCategories = categoriesData.filter(cat => 
          cat && typeof cat === 'string' && cat.trim()
        );
        setCategories(validCategories.length > 0 ? validCategories : DEFAULT_CATEGORIES);
        console.log('✅ Categories loaded:', validCategories.length);
      } else {
        throw new Error('Invalid categories response');
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch categories, using defaults:', err.message);
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [apiClient]);

  // Handle plant addition
  const handlePlantAdded = useCallback(async (plantData) => {
    try {
      console.log('➕ Adding new plant...');
      const response = await apiClient.post('/plants', plantData);
      
      if (response.data && response.data.success) {
        console.log('✅ Plant added successfully');
        await fetchPlants({
          search: searchQuery,
          category: selectedCategory
        });
        setShowAddModal(false);
        alert('Plant added successfully!');
      } else {
        throw new Error(response.data?.error || 'Failed to add plant');
      }
    } catch (err) {
      console.error('❌ Error adding plant:', err);
      throw err;
    }
  }, [fetchPlants, searchQuery, selectedCategory, apiClient]);

  // Handle search
  const handleSearch = useCallback((query) => {
    console.log('🔍 Searching for:', query);
    setSearchQuery(query);
    fetchPlants({
      search: query,
      category: selectedCategory
    });
  }, [fetchPlants, selectedCategory]);

  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    console.log('📁 Category changed to:', category);
    setSelectedCategory(category);
    fetchPlants({
      search: searchQuery,
      category: category
    });
  }, [fetchPlants, searchQuery]);

  // Retry function
  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying...');
    setError(null);
    fetchPlants({
      search: searchQuery,
      category: selectedCategory
    });
  }, [fetchPlants, searchQuery, selectedCategory]);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data in sequence to avoid overwhelming the server
        await fetchPlants();
        await fetchCategories();
        
        console.log('✅ App initialized successfully');
      } catch (err) {
        console.error('❌ Error initializing app:', err);
        setError('Failed to initialize application. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []); // Remove dependencies to avoid infinite loops

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        showAddForm={showAddModal}
        setShowAddForm={setShowAddModal}
        plants={plants}
      />
      
      <Banner 
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryChange}
        categories={categories}
      />

      <main className="app-main">
        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Plants</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleRetry}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading plants...</p>
            </div>
          </div>
        )}

        {/* Plant Grid */}
        {!loading && !error && (
          <section id="plants-section">
            <PlantGrid 
              plants={plants}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSearch={handleSearch}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && plants.length === 0 && (
          <section className="empty-section">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants available</h3>
                <p className="text-gray-500 mb-4">
                  It looks like there are no plants in the catalog yet.
                </p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add First Plant
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handlePlantAdded}
        categories={categories}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
