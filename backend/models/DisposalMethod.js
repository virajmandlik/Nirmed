const mongoose = require('mongoose');

const disposalMethodSchema = new mongoose.Schema({
  wasteType: { 
    type: String, 
    required: true, 
    enum: ['biohazardous', 'pharmaceutical', 'chemical', 'general'] 
  },
  method: { type: String, required: true },
  environmentalImpact: {
    carbonFootprint: { type: Number },
    cost: { type: Number },
    sustainability: { type: String }
  },
  instructions: [{ type: String }],
  cost: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DisposalMethod', disposalMethodSchema);