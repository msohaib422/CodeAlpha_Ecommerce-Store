import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const Profile = () => {
  const { userInfo, login } = useContext(StoreContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const [name, setName] = useState(userInfo ? userInfo.name : '');
  const [email, setEmail] = useState(userInfo ? userInfo.email : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userInfo) return;

    const fetchMyOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await fetch('/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load order history');
        }

        setOrders(data);
        setOrdersError(null);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setUpdateLoading(true);
      const updateBody = { name, email };
      if (password) {
        updateBody.password = password;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(updateBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      login(data); // Sync local context state
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-heading page-title mb-0">My Account</h1>
        <Link to="/" className="btn btn-premium-outline">
          <i className="bi bi-arrow-left me-2"></i>Back to Catalog
        </Link>
      </div>

      <div className="row g-5">
        {/* Left Side: Update Profile Form */}
        <div className="col-12 col-md-4">
          <div className="summary-card border">
            <h3 className="font-heading mb-4 mt-0"><i className="bi bi-person-gear text-primary me-2"></i>Update Info</h3>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded border-0 mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 px-3 small rounded border-0 mb-3" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="profileName">Full Name</label>
                <input
                  type="text"
                  id="profileName"
                  className="form-control form-control-custom w-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="profileEmail">Email Address</label>
                <input
                  type="email"
                  id="profileEmail"
                  className="form-control form-control-custom w-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" required htmlFor="profilePassword">New Password</label>
                <input
                  type="password"
                  id="profilePassword"
                  className="form-control form-control-custom w-100"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted" htmlFor="profileConfirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="profileConfirmPassword"
                  className="form-control form-control-custom w-100"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="btn btn-premium w-100 py-3 font-heading fw-bold"
              >
                {updateLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving Changes...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order History */}
        <div className="col-12 col-md-8">
          <div className="summary-card border h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h3 className="font-heading mt-0 mb-0"><i className="bi bi-clock-history text-primary me-2"></i>Order History</h3>
              {orders.length > 0 && (
                <div className="search-wrapper" style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
                  <input
                    type="text"
                    className="form-control form-control-custom search-input w-100"
                    placeholder="Search by Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="bi bi-search position-absolute text-muted" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }}></i>
                </div>
              )}
            </div>

            {ordersLoading ? (
              <div className="d-flex justify-content-center my-4 py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : ordersError ? (
              <div className="alert alert-danger py-2 px-3 small border-0" role="alert">
                Failed to load orders: {ordersError}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bag-x text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-3">You haven't placed any orders yet.</p>
                <Link to="/" className="btn btn-premium-outline mt-2">
                  Browse Store Catalog
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom table-hover m-0" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Placed Date</th>
                      <th>Grand Total</th>
                      <th>Payment Status</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((order) => (
                      <tr key={order._id}>
                        <td className="fw-bold">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="fw-bold">${order.totalPrice.toFixed(2)}</td>
                        <td>
                          {order.isPaid ? (
                            <span className="badge bg-success-subtle text-success badge-custom">
                              Paid
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger badge-custom">
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className="badge bg-success-subtle text-success badge-custom">
                              Delivered
                            </span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning badge-custom">
                              Processing
                            </span>
                          )}
                        </td>
                        <td>
                          <Link to={`/order/${order._id}`} className="btn btn-premium-outline btn-sm py-1 px-2">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {orders.filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && searchQuery && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No orders found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
