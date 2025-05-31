const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String }
});

const trainingModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['medical_staff', 'disposal_staff', 'both'] 
  },
  duration: { type: Number, required: true }, // in minutes
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);