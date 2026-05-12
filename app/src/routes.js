const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'devsecops-app'
  });
});

// Home endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to DevSecOps Demo API',
    version: '1.0.0'
  });
});

// Users endpoint (demo)
router.get('/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Alice', role: 'DevOps Engineer' },
    { id: 2, name: 'Bob', role: 'Security Engineer' }
  ]);
});

module.exports = router;
