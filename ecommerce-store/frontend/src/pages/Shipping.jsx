import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress, userInfo } = useContext(StoreContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    }
  }, [userInfo, navigate]);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all address fields');
      return;
    }
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/placeorder');
  };

  return (
    <div className="container text-start">
      {/* Checkout Progress Bar */}
      <div className="row justify-content-center my-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="d-flex justify-content-between text-center mb-4 small fw-bold">
            <span className="text-primary"><i className="bi bi-check2-circle"></i> Login</span>
            <span className="text-primary border-bottom border-2 border-primary pb-1">Shipping</span>
            <span className="text-muted">Place Order</span>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="summary-card p-5 border">
            <h1 className="font-heading fs-3 fw-800 text-dark mb-4 mt-0">
              Shipping Address
            </h1>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded border-0 mb-4" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Address */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  className="form-control form-control-custom w-100"
                  placeholder="Enter street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* City */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control form-control-custom w-100"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              {/* Postal Code & Country */}
              <div className="row">
                <div className="col-12 col-sm-6 mb-3">
                  <label className="form-label small fw-bold text-muted" htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    className="form-control form-control-custom w-100"
                    placeholder="ZIP / Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6 mb-4">
                  <label className="form-label small fw-bold text-muted" htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    className="form-control form-control-custom w-100"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-premium-outline py-3 flex-grow-1"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="btn btn-premium py-3 flex-grow-1 font-heading fw-bold"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
