import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const PlaceOrder = () => {
  const {
    cartItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
    userInfo,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Route protection
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      navigate('/shipping');
    }
  }, [userInfo, cartItems, shippingAddress, navigate]);

  if (!userInfo) {
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderBody = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress,
        paymentMethod: 'PayPal',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-start">
      {/* Checkout Progress Bar */}
      <div className="row justify-content-center my-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="d-flex justify-content-between text-center mb-4 small fw-bold">
            <span className="text-primary"><i className="bi bi-check2-circle"></i> Login</span>
            <span className="text-primary"><i className="bi bi-check2-circle"></i> Shipping</span>
            <span className="text-primary border-bottom border-2 border-primary pb-1">Place Order</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-3 px-4 rounded border-0 mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
          <span>Order placement error: {error}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Left Side: Order Details */}
        <div className="col-12 col-lg-8">
          {/* Shipping Review */}
          <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
            <h3 className="font-heading mb-3"><i className="bi bi-geo-alt text-primary me-2"></i>Shipping Details</h3>
            <p className="mb-1 text-dark"><strong>Recipient:</strong> {userInfo.name} ({userInfo.email})</p>
            <p className="mb-0 text-muted">
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method Review */}
          <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
            <h3 className="font-heading mb-3"><i className="bi bi-credit-card text-primary me-2"></i>Payment Method</h3>
            <p className="mb-0 text-dark"><strong>Method:</strong> Simulated PayPal / Credit Card</p>
          </div>

          {/* Cart Items Review */}
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h3 className="font-heading mb-4"><i className="bi bi-bag-check text-primary me-2"></i>Review Order Items</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="row align-items-center g-3 border-bottom pb-3 mb-3 mx-0">
                <div className="col-3 col-sm-2 text-center text-sm-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded border"
                    style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-9 col-sm-6 text-start">
                  <Link to={`/product/${item._id}`} className="text-decoration-none fw-bold text-dark d-block text-truncate">
                    {item.name}
                  </Link>
                  <span className="small text-muted">Brand: {item.brand || 'Premium'}</span>
                </div>
                <div className="col-12 col-sm-4 text-start text-sm-end">
                  <span className="fw-bold fs-6">
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Price Summary Card */}
        <div className="col-12 col-lg-4">
          <div className="summary-card">
            <h3 className="font-heading mb-4 pb-2 border-bottom">Billing Summary</h3>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Items Total:</span>
              <span className="fw-bold text-dark">${itemsPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Shipping cost:</span>
              <span className="fw-bold text-dark">
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Estimated Tax (15%):</span>
              <span className="fw-bold text-dark">${taxPrice.toFixed(2)}</span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5">Grand Total:</span>
              <span className="fw-bold fs-4 text-dark">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-premium w-100 py-3 font-heading fw-bold"
              type="button"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing Order...
                </>
              ) : (
                <>
                  Place Order<i className="bi bi-wallet2 ms-2"></i>
                </>
              )}
            </button>
            
            <Link to="/shipping" className="btn btn-premium-outline w-100 py-3 mt-3">
              <i className="bi bi-arrow-left me-2"></i>Edit Address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
