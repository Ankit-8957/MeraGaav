const mongoose = require("mongoose");
const village = require("./village");
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  villagerName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mobile:{
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
