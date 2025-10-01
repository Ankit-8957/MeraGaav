const mongoose = require("mongoose");
const projectData = require("./projectData.js");
const Project = require("../model/project.js");
const village = require("../model/village.js");
const budget = require("../model/budget.js");
const complaint = require("../model/complaint.js");
const villageData = require("./villageData.js");
const budgetData = require("./budgetData.js");
const complaintData = require("./complaint.js");
main().then(() => {
    console.log("Database is connected!!");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb+srv://yash0011pandey:6CchKjKhw7kM2CdX@cluster0.ynvpjhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}


const initData = async () => {
    await Project.deleteMany({});
    await Project.insertMany(projectData);
}
const initVillData = async () => {
    
    const villages = villageData.map(v => ({ name: v }));
    await village.insertMany(villages);
}
const initBudgetData = async () =>{
    await budget.deleteMany({});
    await budget.insertMany(budgetData);
}
const initComplaintData = async () =>{
    await complaint.deleteMany({});
    await complaint.insertMany(complaintData);
}


initBudgetData();

