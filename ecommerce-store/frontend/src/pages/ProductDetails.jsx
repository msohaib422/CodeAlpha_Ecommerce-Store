import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, userInfo } = useContext(StoreContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (product && product.countInStock > 0) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        navigate('/cart'); // Redirect to cart page after adding
      }, 1000);
    }
  };


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (rating >= i - 0.5) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5 py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger rounded-3 p-4 my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
          <span>Failed to load product details: {error}</span>
        </div>
        <Link to="/" className="btn btn-premium-outline">
          <i className="bi bi-arrow-left me-2"></i>Back to Catalog
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container text-start">
      <Link to="/" className="btn btn-premium-outline mb-4">
        <i className="bi bi-arrow-left me-2"></i>Back to Catalog
      </Link>

      <div className="row g-5">
        {/* Left Side: Product Image */}
        <div className="col-12 col-md-6">
          <div className="bg-white p-4 rounded-4 border text-center shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-3"
              style={{ maxHeight: '480px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right Side: Product Details & Cart Box */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column h-100">
            <span className="text-uppercase text-primary small fw-bold mb-2" style={{ letterSpacing: '1px' }}>
              {product.category}
            </span>
            <h1 className="font-heading fs-2 fw-800 text-dark mb-3 mt-0" style={{ lineHeight: '1.2' }}>
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="star-rating fs-5">{renderStars(product.rating)}</div>
              <span className="text-muted small">
                {product.rating.toFixed(1)} / 5.0 ({product.numReviews} customer reviews)
              </span>
            </div>

            {/* Price tag */}
            <div className="mb-4">
              <span className="fs-1 fw-800 text-dark">${product.price.toFixed(2)}</span>
            </div>

            <hr className="my-4 border-color" />

            {/* Description */}
            <h5 className="font-heading mb-2">About This Product</h5>
            <p className="text-muted mb-4" style={{ fontSize: '15px' }}>
              {product.description}
            </p>

            <div className="mb-4 small">
              <span className="text-muted d-block mb-1">
                <strong>Brand:</strong> {product.brand}
              </span>
              <span className="text-muted d-block">
                <strong>Category:</strong> {product.category}
              </span>
            </div>

            <hr className="my-4 border-color" />
            
            {/* Purchase Options Form */}
            {window.location.hash !== '#review' && (
              <div className="summary-card p-4">
                <div className="row align-items-center g-3">
                  <div className="col-6">Price:</div>
                  <div className="col-6 text-end fw-bold fs-5 text-dark">
                    ${(product.price * qty).toFixed(2)}
                  </div>

                  <div className="col-6">Status:</div>
                  <div className="col-6 text-end">
                    {product.countInStock > 0 ? (
                      <span className="badge bg-success-subtle text-success badge-custom">In Stock ({product.countInStock})</span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger badge-custom">Out of Stock</span>
                    )}
                  </div>

                  {product.countInStock > 0 && (
                    <>
                      <div className="col-6">Quantity:</div>
                      <div className="col-6 text-end">
                        <select
                          className="form-select form-control-custom py-1 px-2 d-inline-block w-auto"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-12 mt-4">
                    {product.countInStock > 0 ? (
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <button
                          onClick={handleAddToCart}
                          className={`btn ${added ? 'btn-premium-secondary' : 'btn-premium'} w-100 py-3`}
                          type="button"
                        >
                          {added ? (
                            <>
                              <i className="bi bi-check-lg me-2 fs-5"></i>Added!
                            </>
                          ) : (
                            <>
                              <i className="bi bi-cart-plus me-2 fs-5"></i>Add to Cart
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (!userInfo) {
                              navigate('/login');
                              return;
                            }
                            addToCart(product, qty);
                            navigate('/shipping');
                          }}
                          className="btn btn-premium-secondary w-100 py-3"
                          type="button"
                        >
                          <i className="bi bi-bag-check me-2 fs-5"></i>Place Order
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary w-100 py-3" disabled type="button">
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row mt-5" id="review">
        <div className="col-12 col-md-8 mx-auto">
          <div className="summary-card p-4">
            <h3 className="font-heading mb-4">Customer Reviews</h3>
            {product.reviews && product.reviews.length === 0 && <div className="alert alert-info py-2 small border-0">No reviews yet for this product.</div>}
            
            {product.reviews && product.reviews.map((review) => (
              <div key={review._id} className="mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between mb-1">
                  <strong>{review.name}</strong>
                  <span className="star-rating fs-6">{renderStars(review.rating)}</span>
                </div>
                <p className="small text-muted mb-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
