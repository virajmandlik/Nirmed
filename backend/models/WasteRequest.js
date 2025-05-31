const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true }, // Remove required: true
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wasteType: { 
    type: String, 
    required: true, 
    enum: ['biohazardous', 'pharmaceutical', 'chemical', 'general'] 
  },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  department: { type: String, required: true },
  urgency: { 
    type: String, 
    required: true, 
    enum: ['low', 'medium', 'high', 'critical'] 
  },
  instructions: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'processing', 'completed'],
    default: 'pending'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disposalMethod: { type: String },
  disposalLocation: { type: String },
  completedAt: { type: Date },
  environmentalImpact: {
    carbonFootprint: { type: Number },
    costEstimate: { type: Number },
    recyclingPotential: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

// Generate unique request ID before saving
wasteRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const count = await mongoose.model('WasteRequest').countDocuments();
    this.requestId = `HWM-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);