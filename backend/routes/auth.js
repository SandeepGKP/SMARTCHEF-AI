const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const router = express.Router();

// Fallback JWT secret for development (should be replaced with environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';

// Test endpoint to check environment variables
router.get('/test', (req, res) => {
  console.log('🔍 Test endpoint called');
  console.log('🔍 Environment variables check:');
  console.log('🔍 JWT_SECRET exists:', !!JWT_SECRET);
  console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  
  res.json({
    jwtSecretExists: !!JWT_SECRET,
    mongoUriExists: !!process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV,
    message: 'Backend is running and environment check complete'
  });
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.log('❌ Registration error - :', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔍 Login attempt for email:', email);
  console.log('🔍 JWT_SECRET exists:', !!JWT_SECRET);
  
  try {
    const user = await User.findOne({ email });
    console.log('🔍 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', valid);
    
    if (!valid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!JWT_SECRET) {
      console.log('❌ JWT_SECRET not found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token generated successfully');
    console.log('✅ Sending response with token and user data');
    
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.log('❌ Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Add this route to fetch user info from token
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  console.log('🔍 /me endpoint called');
  console.log('🔍 Auth header:', authHeader);
  console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid auth header');
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔍 Token extracted:', token ? 'Token exists' : 'No token');

  try {
    if (!JWT_SECRET) {
      console.log('❌ JWT_SECRET not found in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔍 Token decoded successfully:', decoded);
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('🔍 User found:', user);
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ Sending user data:', user);
    res.json({ user });
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
});

module.exports = router;
