import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart, userInfo } = useContext(StoreContext);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent linking to detail page on button click
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (product.countInStock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500); // Reset feedback after 1.5s
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
      } else if (rating >= i - 0.5) {
        stars.push(<i key={i} className="bi bi-star-half"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star"></i>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="card-img-wrapper d-block">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.name}
        </Link>
        <div className="product-card-rating">
          <div className="star-rating">{renderStars(product.rating)}</div>
          <span className="text-muted small">({product.numReviews})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          {product.countInStock > 0 ? (
            <button
              onClick={handleAddToCart}
              className={`btn ${added ? 'btn-premium-secondary' : 'btn-premium'} btn-sm py-2 px-3`}
              aria-label={`Add ${product.name} to cart`}
              type="button"
            >
              {added ? (
                <>
                  <i className="bi bi-check-lg me-1"></i>Added
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-1"></i>Cart
                </>
              )}
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm py-2 px-3" disabled type="button">
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
