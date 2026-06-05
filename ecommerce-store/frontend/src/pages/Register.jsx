import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, userInfo } = useContext(StoreContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-start">
      <div className="row justify-content-center my-5">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="summary-card p-5 border">
            <h1 className="font-heading fs-3 fw-800 text-dark mb-4 text-center mt-0">
              Create an Account
            </h1>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded border-0 mb-4" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control form-control-custom w-100"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-custom w-100"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-custom w-100"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control form-control-custom w-100"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-premium w-100 py-3 mb-4 font-heading fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="text-center text-muted small">
              Already have an account?{' '}
              <Link
                to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
                className="text-primary fw-bold text-decoration-none"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
