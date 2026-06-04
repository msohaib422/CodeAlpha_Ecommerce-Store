import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
      : {};

    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    const products = await Product.find({ ...keyword, ...category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.id || req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = new Product({
      name: name || 'Sample Name',
      price: price || 0,
      user: req.user._id,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      brand: brand || 'Sample Brand',
      category: category || 'Sample Category',
      countInStock: countInStock || 0,
      numReviews: 0,
      description: description || 'Sample Description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.brand = brand ?? product.brand;
      product.category = category ?? product.category;
      product.countInStock = countInStock ?? product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Count how many delivered orders the user has for this product
      const deliveredOrders = await Order.countDocuments({
        user: req.user._id,
        isDelivered: true,
        'orderItems.product': product._id
      });

      if (deliveredOrders === 0) {
        return res.status(400).json({ message: 'You can only review products that have been delivered to you' });
      }

      // Count how many reviews the user has already written for this product
      const userReviewCount = product.reviews.filter(
        (r) => r.user.toString() === req.user._id.toString()
      ).length;

      if (userReviewCount >= deliveredOrders) {
        return res.status(400).json({ message: 'You have already reviewed this product for all your delivered orders' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
