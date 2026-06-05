import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const Header = () => {
  const { cartItems, userInfo, logout } = useContext(StoreContext);
  const [keyword, setKeyword] = useState('');


  const navigate = useNavigate();
  const location = useLocation();



  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/');
    }
  };

  // Sync search input with URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get('search') || '';
    setKeyword(searchVal);
  }, [location.search]);

  // Count total items in cart
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="navbar-custom">
      <div className="container">
        <div className="row w-100 align-items-center justify-content-between g-3 m-0">
          
          {/* Logo */}
          <div className="col-auto p-0">
            <Link className="navbar-brand-custom text-decoration-none" to="/">
              Alpha<span>Store</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="col-12 col-md-5 order-3 order-md-2 p-0 px-md-3">
            <form onSubmit={handleSearchSubmit} className="search-wrapper w-100 mx-auto">
              <input
                type="text"
                className="form-control search-input w-100"
                placeholder="Search products, brands..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          {/* Nav Items */}
          <div className="col-auto order-2 order-md-3 p-0 d-flex align-items-center gap-3 justify-content-end">
            


            {/* Cart Link */}
            <Link to="/cart" className="btn btn-premium-outline position-relative d-flex align-items-center gap-2 py-2 px-3">
              <i className="bi bi-cart3 fs-5"></i>
              <span className="d-none d-sm-inline">Cart</span>
              {cartItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge cart-badge">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth */}
            {userInfo ? (
              <div className="dropdown">
                <button
                  className="btn btn-premium dropdown-toggle py-2 px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="ms-2 d-none d-sm-inline">{userInfo.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2 text-primary"></i>My Profile
                    </Link>
                  </li>
                  {userInfo.isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <h6 className="dropdown-header">Admin Control</h6>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin">
                          <i className="bi bi-speedometer2 me-2 text-danger"></i>Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger w-100 text-start" onClick={() => { logout(); navigate('/'); }}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-premium py-2 px-4">
                Login
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
