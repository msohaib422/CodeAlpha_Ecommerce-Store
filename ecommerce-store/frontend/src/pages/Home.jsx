import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  const categories = ['All', 'Electronics', 'Audio', 'Wearables', 'Fashion', 'Travel'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/api/products';
        const params = [];
        if (searchKeyword) {
          params.push(`keyword=${encodeURIComponent(searchKeyword)}`);
        }
        if (selectedCategory && selectedCategory !== 'All') {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchKeyword, selectedCategory]);

  const handleCategoryClick = (category) => {
    const params = {};
    if (searchKeyword) params.search = searchKeyword;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  return (
    <div className="container">
      {/* Hero Promo Banner */}
      {!searchKeyword && selectedCategory === 'All' && (
        <div 
          className="p-5 mb-5 rounded-4 position-relative overflow-hidden shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: '#fff'
          }}
        >
          <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'scale(1.5)', pointerEvents: 'none' }}>
            <i className="bi bi-shop-window" style={{ fontSize: '20rem' }}></i>
          </div>
          <div className="row align-items-center py-4 position-relative">
            <div className="col-lg-7 text-start">
              <span className="badge bg-white text-primary mb-3 fw-bold px-3 py-2 text-uppercase" style={{ letterSpacing: '1px' }}>
                Summer Collection 2026
              </span>
              <h1 className="display-4 font-heading fw-800 text-white mb-3" style={{ lineHeight: '1.1' }}>
                Elevate Your Everyday Style & tech
              </h1>
              <p className="lead mb-4 text-white-50">
                Discover the best electronics, premium audio gears, smart wearables, and canvas travel packs. Crafted for high-performance and modern urban lifestyle.
              </p>
              <div className="d-flex gap-3">
                <button onClick={() => handleCategoryClick('Electronics')} className="btn btn-light text-primary font-heading fw-bold px-4 py-3 border-0">
                  Shop Electronics
                </button>
                <button onClick={() => handleCategoryClick('Fashion')} className="btn btn-outline-light font-heading fw-bold px-4 py-3">
                  Browse Fashion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Header */}
      <div className="row align-items-center justify-content-between mb-4">
        <div className="col-12 col-md-auto text-start">
          <h2 className="font-heading page-title mb-1">
            {searchKeyword ? `Search Results for "${searchKeyword}"` : selectedCategory === 'All' ? 'Latest Products' : `${selectedCategory} Collection`}
          </h2>
          <p className="text-muted small">
            Showing {products.length} products
          </p>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="d-flex justify-content-center my-5 py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3 p-4 my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
          <span>Failed to load products catalog: {error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center my-5 py-5 bg-white rounded-4 border p-5">
          <i className="bi bi-emoji-frown text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3 font-heading">No Products Found</h3>
          <p className="text-muted mb-4">We couldn't find any products matching your search criteria.</p>
          <button onClick={() => setSearchParams({})} className="btn btn-premium">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 text-start">
          {products.map((product) => (
            <div key={product._id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
