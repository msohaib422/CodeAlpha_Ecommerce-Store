import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const Cart = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    addToCart,
    removeFromCart,
    userInfo,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  const handleQtyChange = (item, qty) => {
    addToCart(item, qty);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="container text-start">
      <h1 className="font-heading page-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center my-5 py-5 bg-white rounded-4 border p-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
          <h2 className="mt-3 font-heading">Your Cart is Empty</h2>
          <p className="text-muted mb-4">You have no items in your shopping cart. Start exploring our premium collections today!</p>
          <Link to="/" className="btn btn-premium px-5 py-3">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-12 col-lg-8">
            {cartItems.map((item) => (
              <div key={item._id} className="row cart-row g-3 mx-0">
                {/* Image */}
                <div className="col-4 col-sm-2 text-center text-sm-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded border"
                    style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div className="col-8 col-sm-4 text-start">
                  <Link to={`/product/${item._id}`} className="text-decoration-none fw-bold text-dark d-block text-truncate">
                    {item.name}
                  </Link>
                  <span className="small text-muted">Price: ${item.price.toFixed(2)}</span>
                </div>

                {/* Price (Single item) */}
                <div className="col-4 col-sm-2 text-start text-sm-center">
                  <span className="fw-bold">${item.price.toFixed(2)}</span>
                </div>

                {/* Qty Selector */}
                <div className="col-5 col-sm-2 text-center">
                  <select
                    className="form-select form-control-custom py-1 px-2 d-inline-block w-auto"
                    value={item.qty}
                    onChange={(e) => handleQtyChange(item, Number(e.target.value))}
                  >
                    {[...Array(Math.min(10, item.countInStock)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                <div className="col-3 col-sm-2 text-end">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-outline-danger btn-sm border-0"
                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                    title="Remove item"
                    type="button"
                  >
                    <i className="bi bi-trash3 fs-5"></i>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Link to="/" className="btn btn-premium-outline">
                <i className="bi bi-arrow-left me-2"></i>Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="summary-card">
              <h3 className="font-heading mb-4 pb-2 border-bottom">Order Summary</h3>

              <div className="d-flex justify-content-between mb-3 small">
                <span>Items Subtotal ({totalItemsCount}):</span>
                <span className="fw-bold text-dark">${itemsPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span>Shipping:</span>
                <span className="fw-bold text-dark">
                  {shippingPrice === 0 ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span>Estimated Tax (15%):</span>
                <span className="fw-bold text-dark">${taxPrice.toFixed(2)}</span>
              </div>

              {shippingPrice > 0 && (
                <div className="alert alert-warning py-2 small mb-3 border-0 rounded" style={{ fontSize: '12px' }}>
                  <i className="bi bi-info-circle me-1"></i> Add <strong>${(100 - itemsPrice).toFixed(2)}</strong> more for <strong>FREE Shipping!</strong>
                </div>
              )}

              <hr className="my-3" />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Estimated Total:</span>
                <span className="fw-bold fs-4 text-dark">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-premium w-100 py-3 font-heading fw-bold"
                type="button"
              >
                Proceed to Checkout<i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
