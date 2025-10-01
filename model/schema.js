const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaModel = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
    },
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Village"
    }

});

const Yojna = mongoose.model("Yojna", schemaModel);
module.exports = Yojna;