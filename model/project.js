const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const milestoneSchema = new Schema({
    name: String,              // e.g. "Foundation work"
    completed: { type: Boolean, default: false }
});
const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Village",
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    completeDate: {
        type: Date
    },
    budget: {
        type: Number
    },
    milestones: [milestoneSchema],
    image: [{
        filename: {
            type: String,
            default: "my-project"
        },
        url: {
            type: String
        }
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    votes: { type: Number, default: 0 },
    voters: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

projectSchema.virtual("progress").get(function () {
    if (!this.milestones || this.milestones.length === 0) return 0;

    const completed = this.milestones.filter(m => m.completed).length;
    return Math.round((completed / this.milestones.length) * 100);
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;