const express = require('express');
const router = express.Router();
const Admin = require('./backend-Admin');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key';

// POST /api/admin-login
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const admin = await Admin.findOne({ username, password });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
