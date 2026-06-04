import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const products = [
  {
    name: 'Quantum Pro Ultrabook',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&w=600&q=80',
    description: 'High-performance ultrabook featuring an ultra-slim metallic chassis, 16GB RAM, 512GB NVMe SSD, and a gorgeous 14-inch QHD borderless display. Perfect for productivity and developers on the move.',
    brand: 'QuantumTech',
    category: 'Electronics',
    price: 1299.99,
    countInStock: 8,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'Zenith ANC Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Immerse yourself in pure high-fidelity sound. Features hybrid active noise cancellation, smart ambient transparency mode, up to 40 hours of battery life, and plush memory foam earcups.',
    brand: 'Acoustic Labs',
    category: 'Audio',
    price: 299.99,
    countInStock: 15,
    rating: 4.6,
    numReviews: 48,
  },
  {
    name: 'AeroSport Smartwatch Series 5',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Track your performance with advanced GPS tracking, dynamic heart-rate monitor, blood oxygen levels, and customizable workout profiles. Water-resistant up to 50 meters and features a 7-day battery life.',
    brand: 'AeroWear',
    category: 'Wearables',
    price: 249.99,
    countInStock: 12,
    rating: 4.5,
    numReviews: 32,
  },
  {
    name: 'StreetWear Retro Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'A classic silhouette redesigned for modern comfort. Features a premium leather upper, shock-absorbing cushioned midsoles, and high-grip rubber outsoles for everyday urban wear.',
    brand: 'StreetFit',
    category: 'Fashion',
    price: 89.99,
    countInStock: 25,
    rating: 4.2,
    numReviews: 18,
  },
  {
    name: 'Urban Nomad Canvas Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy-duty water-repellent canvas pack with genuine leather accents. Includes a padded 15.6-inch laptop compartment, hidden anti-theft back pocket, and magnetic quick-access buckles.',
    brand: 'NomadGear',
    category: 'Travel',
    price: 79.99,
    countInStock: 30,
    rating: 4.7,
    numReviews: 55,
  },
  {
    name: 'Aperture DX Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    description: 'Unleash your creativity with 24.2 MP CMOS sensor, 4K high-bitrate video recording, high-speed 5-axis image stabilization, and a 180-degree tilting touchscreen display. Includes 16-50mm kit lens.',
    brand: 'Aperture',
    category: 'Electronics',
    price: 899.99,
    countInStock: 5,
    rating: 4.9,
    numReviews: 14,
  },
  {
    name: 'VividView 27-inch 4K Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    description: 'Stunning 4K resolution IPS monitor with 99% sRGB color accuracy, ultra-thin bezels, AMD FreeSync support, and dual HDMI/DisplayPort connections. Perfect for designers and gamers alike.',
    brand: 'VividView',
    category: 'Electronics',
    price: 399.99,
    countInStock: 7,
    rating: 4.4,
    numReviews: 29,
  },
  {
    name: 'AcousticWave Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    description: 'IPX7 waterproof portable speaker with rich 360-degree sound, booming bass, and 24-hour playtime. Wirelessly pair multiple units for double the sound.',
    brand: 'Acoustic Labs',
    category: 'Audio',
    price: 149.99,
    countInStock: 20,
    rating: 4.3,
    numReviews: 21,
  }
];

const seedDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-store';
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    
    console.log('Clearing database tables...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Seeding admin and customer accounts...');
    
    // Create Admin
    const adminUser = await User.create({
      name: 'Admin Sohaib',
      email: 'msohaib.store@gmail.com',
      password: '12345678', // will be hashed by userSchema.pre('save')
      isAdmin: true,
    });

    // Create Customer
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false,
    });

    console.log(`Accounts created!`);
    console.log(`  Admin: ${adminUser.email}`);
    console.log(`  Customer: ${customerUser.email}`);

    console.log('Seeding products catalog...');
    await Product.insertMany(products);
    console.log('Products successfully loaded!');

    console.log('Seeding complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
