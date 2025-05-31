const express = require('express');
const { 
  createRequest, 
  getMyRequests, 
  getRequestById,
  getPendingRequests,
  assignRequest,
  completeRequest
} = require('../controllers/wasteRequestController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Routes for medical staff
router.post('/create', protect, restrictTo('medical_staff'), createRequest);
router.get('/my-requests', protect, restrictTo('medical_staff'), getMyRequests);

// Routes for disposal staff
router.get('/pending', protect, restrictTo('disposal_staff'), getPendingRequests);
router.put('/:id/assign', protect, restrictTo('disposal_staff'), assignRequest);
router.put('/:id/complete', protect, restrictTo('disposal_staff'), completeRequest);

// This should come AFTER all specific routes
router.get('/:id', protect, getRequestById);

module.exports = router;