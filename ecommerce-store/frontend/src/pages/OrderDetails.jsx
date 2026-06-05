import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [payLoading, setPayLoading] = useState(false);
  const [deliverLoading, setDeliverLoading] = useState(false);

  // Review state
  const [reviewProductId, setReviewProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order could not be found');
      }

      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [id, userInfo, navigate]);

  const handlePayment = async () => {
    try {
      setPayLoading(true);
      const response = await fetch(`/api/orders/${order._id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment simulation failed');
      }

      setOrder(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setPayLoading(false);
    }
  };

  const handleDeliver = async () => {
    try {
      setDeliverLoading(true);
      const response = await fetch(`/api/orders/${order._id}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delivery update failed');
      }

      setOrder(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeliverLoading(false);
    }
  };

  const submitReviewHandler = async (e, productId) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    try {
      setReviewLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Review failed');
      }
      setReviewSuccess(productId);
      setRating(0);
      setComment('');
      setReviewProductId(null);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (!userInfo) {
    return null;
  }

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
          <span>Failed to load order: {error}</span>
        </div>
        <Link to="/profile" className="btn btn-premium-outline">
          <i className="bi bi-person me-2"></i>Go to My Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container text-start">
      <div className="row align-items-center justify-content-between mb-4">
        <div className="col-auto">
          <Link to="/profile" className="btn btn-premium-outline btn-sm mb-3">
            <i className="bi bi-arrow-left me-1"></i>Order History
          </Link>
          <h1 className="font-heading fs-3 fw-800 text-dark mb-0 mt-0">
            Order Reference: #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <p className="text-muted small mb-0 mt-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side Info */}
        <div className="col-12 col-lg-8">
          {/* Shipping Status */}
          <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
            <h3 className="font-heading mb-3"><i className="bi bi-geo-alt text-primary me-2"></i>Shipping Address</h3>
            <p className="mb-2 text-dark"><strong>Customer Name:</strong> {order.user ? order.user.name : userInfo.name}</p>
            <p className="mb-3 text-muted">
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="alert alert-success py-2 px-3 m-0 rounded border-0 d-inline-flex align-items-center gap-2 small">
                <i className="bi bi-patch-check-fill fs-6"></i>
                Delivered at {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-warning py-2 px-3 m-0 rounded border-0 d-inline-flex align-items-center gap-2 small">
                <i className="bi bi-truck fs-6"></i>
                Awaiting dispatch / Not Delivered
              </div>
            )}
          </div>

          {/* Billing Status */}
          <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
            <h3 className="font-heading mb-3"><i className="bi bi-wallet2 text-primary me-2"></i>Payment Details</h3>
            <p className="mb-3 text-dark"><strong>Payment Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="alert alert-success py-2 px-3 m-0 rounded border-0 d-inline-flex align-items-center gap-2 small">
                <i className="bi bi-cash-coin fs-6"></i>
                Paid via {order.paymentMethod} on {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-danger py-2 px-3 m-0 rounded border-0 d-inline-flex align-items-center gap-2 small">
                <i className="bi bi-cash fs-6"></i>
                Unpaid / Processing pending
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h3 className="font-heading mb-4"><i className="bi bi-box-seam text-primary me-2"></i>Ordered Items</h3>
            {order.orderItems.map((item) => (
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
                  <Link to={`/product/${item.product}`} className="text-decoration-none fw-bold text-dark d-block text-truncate">
                    {item.name}
                  </Link>
                  <span className="small text-muted">Price: ${item.price.toFixed(2)}</span>
                </div>
                <div className="col-12 col-sm-4 text-start text-sm-end">
                  <span className="fw-bold fs-6 d-block mb-2">
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </span>
                  {order.isDelivered && (
                    <>
                      {reviewSuccess === item.product ? (
                        <span className="badge bg-success-subtle text-success py-1 px-2">
                          <i className="bi bi-check-circle me-1"></i>Review Submitted!
                        </span>
                      ) : reviewProductId === item.product ? (
                        <button
                          onClick={() => { setReviewProductId(null); setRating(0); setComment(''); setReviewError(null); }}
                          className="btn btn-sm btn-premium-outline py-1 px-2"
                        >
                          <i className="bi bi-x-lg me-1"></i>Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => { setReviewProductId(item.product); setReviewError(null); setReviewSuccess(null); }}
                          className="btn btn-sm btn-premium-outline py-1 px-2"
                        >
                          <i className="bi bi-star me-1"></i>Write Review
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Inline Review Form */}
                {order.isDelivered && reviewProductId === item.product && (
                  <div className="col-12 mt-3">
                    <div className="bg-light p-3 rounded-3 border">
                      <h6 className="font-heading mb-3">Review: {item.name}</h6>
                      {reviewError && (
                        <div className="alert alert-danger py-2 px-3 small rounded border-0 mb-3">
                          {reviewError}
                        </div>
                      )}
                      <form onSubmit={(e) => submitReviewHandler(e, item.product)}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Rating</label>
                          <select
                            className="form-select form-control-custom w-100"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            required
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Comment</label>
                          <textarea
                            rows="3"
                            className="form-control form-control-custom w-100"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <button
                          disabled={reviewLoading}
                          type="submit"
                          className="btn btn-premium w-100 py-2"
                        >
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Summary */}
        <div className="col-12 col-lg-4">
          <div className="summary-card">
            <h3 className="font-heading mb-4 pb-2 border-bottom">Price Breakdown</h3>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Items Subtotal:</span>
              <span className="fw-bold text-dark">${order.itemsPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Shipping cost:</span>
              <span className="fw-bold text-dark">${order.shippingPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span>Taxes (15%):</span>
              <span className="fw-bold text-dark">${order.taxPrice.toFixed(2)}</span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5 text-dark">Total:</span>
              <span className="fw-bold fs-4 text-dark">${order.totalPrice.toFixed(2)}</span>
            </div>

            {/* Pay Button for Customers */}
            {!order.isPaid && (
              <button
                onClick={handlePayment}
                disabled={payLoading}
                className="btn btn-premium w-100 py-3 mb-2 font-heading fw-bold"
                type="button"
              >
                {payLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Authorizing...
                  </>
                ) : (
                  <>
                    Simulate Payment<i className="bi bi-credit-card-2-front ms-2"></i>
                  </>
                )}
              </button>
            )}

            {/* Deliver Button for Admins */}
            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={handleDeliver}
                disabled={deliverLoading}
                className="btn btn-premium-secondary w-100 py-3 mt-2 font-heading fw-bold"
                type="button"
              >
                {deliverLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    Mark as Delivered<i className="bi bi-truck ms-2"></i>
                  </>
                )}
              </button>
            )}

            {/* Special Admin indicators */}
            {userInfo.isAdmin && (
              <div className="alert alert-danger py-2 mt-4 small border-0 text-center rounded" style={{ fontSize: '12px' }}>
                <i className="bi bi-shield-lock me-1"></i> You are viewing this order as an <strong>Administrator</strong>.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
