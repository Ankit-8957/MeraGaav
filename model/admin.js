const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/  // Indian 10-digit mobile number validation
    },

    address: {
        type: String,
        required: true
    },
    aadhaar: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{12}$/  // exactly 12 digits
    },

    voterId: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z0-9]+$/  // सिर्फ capital letters और numbers allow करेगा
    },
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Village"
    },

    image: {
        type: String
    },
    role:{
        type: String,
        default: "Admin"
    }
});
adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;