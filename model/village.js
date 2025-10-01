const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  pradhan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
});

module.exports = mongoose.model("Village", villageSchema);
