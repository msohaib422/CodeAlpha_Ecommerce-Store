import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

const AdminDashboard = () => {
  const { userInfo } = useContext(StoreContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const [activeTab, setActiveTab] = useState('products');

  // Product lists states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Edit/Create product states
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [imageType, setImageType] = useState('url');
  const [uploading, setUploading] = useState(false);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products');
      }
      setProducts(data);
      setProductsError(null);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }
      setOrders(data);
      setOrdersError(null);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) return;
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab, userInfo]);

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Deletion failed');
      }
      fetchProducts(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  // Switch to product editing state
  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setDescription(product.description);
    setBrand(product.brand);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setFormError(null);
    setFormSuccess(false);
    
    // Smooth scroll to form
    document.getElementById('product-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset product inputs
  const resetForm = () => {
    setIsEditing(false);
    setEditProductId('');
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
    setBrand('');
    setCategory('');
    setCountInStock('');
    setFormError(null);
    setImageType('url');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setFormError(null);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }

      setImage(data.image);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Submit product create/update
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!name || !price || !description || !brand || !category || countInStock === '') {
      setFormError('Please fill in all product fields');
      return;
    }

    const productBody = {
      name,
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description,
      brand,
      category,
      countInStock: Number(countInStock),
    };

    try {
      const url = isEditing ? `/api/products/${editProductId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Product operation failed');
      }

      setFormSuccess(true);
      resetForm();
      fetchProducts(); // Refresh list
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="container text-start">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="font-heading page-title mb-1">Admin Control Panel</h1>
          <p className="text-muted small">Manage items catalog and process client orders</p>
        </div>
      </div>

      {/* Tabs Selectors */}
      <div className="category-tabs border-bottom pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`category-tab border-0 rounded-0 pb-3 ${activeTab === 'products' ? 'active border-bottom border-primary text-primary' : ''}`}
          style={{ background: 'transparent' }}
          type="button"
        >
          <i className="bi bi-box me-2"></i>Manage Catalog
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`category-tab border-0 rounded-0 pb-3 ${activeTab === 'orders' ? 'active border-bottom border-primary text-primary' : ''}`}
          style={{ background: 'transparent' }}
          type="button"
        >
          <i className="bi bi-receipt me-2"></i>Customer Orders
        </button>
      </div>

      {/* Products Catalog Tab */}
      {activeTab === 'products' && (
        <div className="row g-4 mt-1">
          {/* List of Products */}
          <div className="col-12 col-lg-8">
            <div className="summary-card border">
              <h3 className="font-heading mb-4 mt-0"><i className="bi bi-list-task text-primary me-2"></i>Product Catalog</h3>

              {productsLoading ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : productsError ? (
                <div className="alert alert-danger py-2">{productsError}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom table-hover m-0" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod._id}>
                          <td>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="rounded border"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          </td>
                          <td className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                            {prod.name}
                          </td>
                          <td>{prod.category}</td>
                          <td className="fw-bold">${prod.price.toFixed(2)}</td>
                          <td>
                            {prod.countInStock > 0 ? (
                              <span className="badge bg-success-subtle text-success badge-custom">{prod.countInStock}</span>
                            ) : (
                              <span className="badge bg-danger-subtle text-danger badge-custom">Out</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleEditClick(prod)}
                                className="btn btn-outline-primary btn-sm py-1 px-2"
                                title="Edit"
                                type="button"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id)}
                                className="btn btn-outline-danger btn-sm py-1 px-2"
                                title="Delete"
                                type="button"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="col-12 col-lg-4" id="product-form-container">
            <div className="summary-card border">
              <h3 className="font-heading mb-4 mt-0">
                <i className="bi bi-pencil-square text-primary me-2"></i>
                {isEditing ? 'Edit Product' : 'Create Product'}
              </h3>

              {formError && (
                <div className="alert alert-danger py-2 px-3 small border-0 mb-3">{formError}</div>
              )}

              {formSuccess && (
                <div className="alert alert-success py-2 px-3 small border-0 mb-3">Product saved!</div>
              )}

              <form onSubmit={handleProductSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Product Name</label>
                  <input
                    type="text"
                    className="form-control form-control-custom w-100"
                    placeholder="Enter product title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-custom w-100"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted d-block">Product Image Source</label>
                  <div className="btn-group w-100 mb-2" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${imageType === 'url' ? 'btn-premium' : 'btn-premium-outline'}`}
                      onClick={() => setImageType('url')}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${imageType === 'file' ? 'btn-premium' : 'btn-premium-outline'}`}
                      onClick={() => setImageType('file')}
                    >
                      Upload File
                    </button>
                  </div>
                  {imageType === 'url' ? (
                    <input
                      type="text"
                      className="form-control form-control-custom w-100"
                      placeholder="https://example.com/image.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        className="form-control form-control-custom w-100"
                        onChange={handleFileUpload}
                      />
                      {uploading && (
                        <div className="small text-muted mt-1">
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Uploading file...
                        </div>
                      )}
                      {image && (
                        <div className="small text-success mt-1 text-truncate">
                          Uploaded path: {image}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Brand</label>
                    <input
                      type="text"
                      className="form-control form-control-custom w-100"
                      placeholder="Brand name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Category</label>
                    <select
                      className="form-select form-control-custom w-100"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Travel">Travel</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Count In Stock</label>
                  <input
                    type="number"
                    className="form-control form-control-custom w-100"
                    placeholder="Inventory count"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Description</label>
                  <textarea
                    rows="3"
                    className="form-control form-control-custom w-100"
                    placeholder="Provide details about the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-premium-outline py-2 flex-grow-1"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-premium py-2 flex-grow-1"
                  >
                    {isEditing ? 'Save Changes' : 'Add Catalog Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="summary-card border">
              <h3 className="font-heading mb-4 mt-0"><i className="bi bi-wallet2 text-primary me-2"></i>Customer Orders Database</h3>

              {ordersLoading ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : ordersError ? (
                <div className="alert alert-danger py-2">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-receipt text-muted fs-2"></i>
                  <p className="text-muted mt-2">No orders exist in the database.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom table-hover m-0" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid Status</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id}>
                          <td className="fw-bold">
                            #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                          </td>
                          <td>
                            {ord.user ? (
                              <div>
                                <span className="fw-bold d-block">{ord.user.name}</span>
                                <span className="text-muted small">{ord.user.email}</span>
                              </div>
                            ) : (
                              <span className="text-danger small">Deleted User</span>
                            )}
                          </td>
                          <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold">${ord.totalPrice.toFixed(2)}</td>
                          <td>
                            {ord.isPaid ? (
                              <span className="badge bg-success-subtle text-success badge-custom">
                                Paid on {new Date(ord.paidAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="badge bg-danger-subtle text-danger badge-custom">Unpaid</span>
                            )}
                          </td>
                          <td>
                            {ord.isDelivered ? (
                              <span className="badge bg-success-subtle text-success badge-custom">
                                Delivered on {new Date(ord.deliveredAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="badge bg-warning-subtle text-warning badge-custom">Processing</span>
                            )}
                          </td>
                          <td>
                            <Link to={`/order/${ord._id}`} className="btn btn-premium-outline btn-sm py-1 px-2">
                              Manage Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
