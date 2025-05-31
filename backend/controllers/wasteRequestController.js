const WasteRequest = require('../models/WasteRequest');

// Create a new waste request
exports.createRequest = async (req, res) => {
  try {
    const { 
      wasteType, 
      quantity, 
      unit, 
      department, 
      urgency, 
      instructions 
    } = req.body;

    // Validate required fields
    if (!wasteType || !quantity || !unit || !urgency) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Create new waste request
    const wasteRequest = new WasteRequest({
      createdBy: req.user.id,  // From auth middleware
      wasteType,
      quantity,
      unit,
      department,
      urgency,
      instructions
    });

    // Save the waste request
    await wasteRequest.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      requestId: wasteRequest.requestId,
      request: {
        id: wasteRequest._id,
        requestId: wasteRequest.requestId,
        wasteType: wasteRequest.wasteType,
        quantity: wasteRequest.quantity,
        unit: wasteRequest.unit,
        department: wasteRequest.department,
        urgency: wasteRequest.urgency,
        instructions: wasteRequest.instructions,
        status: wasteRequest.status,
        createdAt: wasteRequest.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all waste requests for the logged-in medical staff
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    // Transform the data to match frontend expectations
    const transformedRequests = requests.map(request => ({
      id: request._id,
      requestId: request.requestId,
      wasteType: request.wasteType,
      quantity: request.quantity,
      unit: request.unit,
      department: request.department,
      urgency: request.urgency,
      instructions: request.instructions,
      status: request.status,
      createdBy: request.createdBy.toString(),
      createdAt: request.createdAt,
      assignedTo: request.assignedTo ? request.assignedTo.toString() : undefined,
      completedAt: request.completedAt,
      disposalMethod: request.disposalMethod,
      disposalLocation: request.disposalLocation,
      environmentalImpact: request.environmentalImpact
    }));

    res.json({
      success: true,
      count: requests.length,
      requests: transformedRequests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get a specific waste request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Waste request not found' 
      });
    }

    // Check if the request belongs to the logged-in user or is assigned to them
    if (request.createdBy.toString() !== req.user.id && 
        (!request.assignedTo || request.assignedTo.toString() !== req.user.id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access this request' 
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all pending waste requests for disposal staff
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find({ status: { $in: ['pending', 'processing'] } })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Assign a waste request to disposal staff (change status to processing)
exports.assignRequest = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Waste request not found' 
      });
    }

    // Update request status and assignedTo
    request.status = 'processing';
    request.assignedTo = req.user.id;
    
    await request.save();

    res.json({
      success: true,
      message: 'Request assigned successfully',
      request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Complete a waste request (change status to completed)
exports.completeRequest = async (req, res) => {
  try {
    const { disposalMethod, disposalLocation } = req.body;

    // Validate required fields
    if (!disposalMethod || !disposalLocation) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide disposal method and location' 
      });
    }

    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Waste request not found' 
      });
    }

    // Check if the request is assigned to the current user
    if (request.assignedTo && request.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to complete this request' 
      });
    }

    // Update request
    request.status = 'completed';
    request.disposalMethod = disposalMethod;
    request.disposalLocation = disposalLocation;
    request.completedAt = new Date();
    
    // Simple environmental impact calculation (placeholder)
    // In a real system, this would be more sophisticated based on waste type and disposal method
    request.environmentalImpact = {
      carbonFootprint: Math.random() * 10, // Random value for demo
      costEstimate: request.quantity * 5, // $5 per unit
      recyclingPotential: request.wasteType === 'general' ? 0.7 : 0.3 // Higher for general waste
    };
    
    await request.save();

    res.json({
      success: true,
      message: 'Request completed successfully',
      request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};