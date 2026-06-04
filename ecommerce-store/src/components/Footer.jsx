import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-12 col-md-4">
            <h5 className="font-heading">AlphaStore</h5>
            <p className="small mb-3">
              Your one-stop destination for premium tech devices, audio accessories, wearables, travel gear, and stylish fashion wear. We offer top quality products with fast shipping and responsive support.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="https://www.facebook.com/profile.php?id=100084497363826" target="_blank" rel="noopener noreferrer" className="text-white-50" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/msohaib_dev/" target="_blank" rel="noopener noreferrer" className="text-white-50" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="https://x.com/msohaib_dev" target="_blank" rel="noopener noreferrer" className="text-white-50" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="https://github.com/msohaib422" target="_blank" rel="noopener noreferrer" className="text-white-50" aria-label="Github"><i className="bi bi-github"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2 offset-md-1">
            <h5>Shop Links</h5>
            <Link to="/" className="footer-link">Home Catalog</Link>
            <Link to="/cart" className="footer-link">Shopping Cart</Link>
            <Link to="/profile" className="footer-link">My Account</Link>
            <Link to="/login" className="footer-link">Login / Register</Link>
          </div>

          {/* Categories */}
          <div className="col-6 col-md-2">
            <h5>Categories</h5>
            <Link to="/?category=Electronics" className="footer-link">Electronics</Link>
            <Link to="/?category=Audio" className="footer-link">Audio Sound</Link>
            <Link to="/?category=Wearables" className="footer-link">Wearables</Link>
            <Link to="/?category=Fashion" className="footer-link">Street Fashion</Link>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-3">
            <h5>Newsletter</h5>
            <p className="small mb-3">Subscribe to get notifications about sales, new releases, and exclusive deals.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control form-control-custom bg-dark border-secondary text-white py-2 custom-footer-input"
                placeholder="Email address"
                aria-label="Email address"
                style={{ fontSize: '13px' }}
              />
              <button className="btn btn-premium px-3" type="button">
                Join
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="row align-items-center justify-content-between g-2">
          <div className="col-12 col-sm-auto text-center text-sm-start">
            <span className="small text-white-50">
              &copy; {new Date().getFullYear()} AlphaStore Inc. All rights reserved.
            </span>
          </div>
          <div className="col-12 col-sm-auto text-center text-sm-end">
            <span className="small text-white-50">
              E-Commerce Platform powered by CodeAlpha
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
