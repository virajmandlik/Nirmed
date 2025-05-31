const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule', required: true },
  completedAt: { type: Date },
  score: { type: Number },
  certificateUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);