const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  requestedBudget: {
    type: Number,
    required: true,
    min: 0
  },
  approvedBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);
