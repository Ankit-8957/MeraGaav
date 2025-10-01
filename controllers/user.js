const village = require("../model/village.js");
const User = require("../model/user.js");
const project = require("../model/project.js");
const budget = require("../model/budget.js");
const Complaint = require("../model/complaint.js");
const Schema = require("../model/schema.js");
const { route } = require("./admin.js");





module.exports.signup = async (req, res) => {
    let data = await village.find({});
    res.render("sections/signupUser.ejs", { data });
}
module.exports.signupPost = async (req, res) => {
    let { fullname, mobile, village, image, username, password } = req.body;
    const newUser = new User({ fullname, mobile, village, image: req.file.path, username,isApproved: false });
    await User.register(newUser, password);
    req.flash("success", "You can access after approval from you Gram-pradhan");
    res.redirect("/user/login");

}
module.exports.login = (req, res) => {
    res.render("sections/loginUser.ejs");
}
module.exports.loginPost = async(req, res) => {
    try {
        if (!req.user.isApproved) {
            req.logOut((err) => {
                if (err) {
                    next(err);
                }
                req.flash("error", "Your account is not approved yet.");
                res.redirect("/user/login");
            })
        } else {
            
            req.flash("success", "You are logged in now !!");
            res.redirect("/user/dashboard");
        }

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/user/login");
    }
}
module.exports.loggedOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out now !!!");
        res.redirect("/");
    })
}
module.exports.dashboard = async (req, res) => {
    let user = await User.findById(req.user._id).populate("village");
    res.render("sections/dashboard.ejs", { user });
}
module.exports.project = async(req, res) => {
    let user = await User.findById(req.user._id).populate("village");
    const userVillage = await req.user.populate("village");
    let projects = await project.find({village: userVillage.village});
    res.render("sections/project.ejs",{projects,user});
}
module.exports.budget = async(req, res) => {
    let budgets = await budget.find({});
    let user = await User.findById(req.user._id).populate("village");
    res.render("sections/budget.ejs",{budgets,user});
}
module.exports.complaint = async(req,res)=>{
    let user = await User.findById(req.user._id).populate("village");
    let data = await village.find({name:user.village.name});
    res.render("sections/raiseComplaint.ejs",{user,data});
}
module.exports.complaintPost = async(req,res)=>{
    
    let {complaint:complaintData} = req.body; 
    const newComplaint = new Complaint({...complaintData})   
    await newComplaint.save();
    req.flash("success","Complaint submitted! We appreciate your feedback.");
    res.redirect("/user/dashboard");
} 
module.exports.schema = async(req,res)=>{
    const userVillage = await req.user.populate("village");
    let user = await User.findById(req.user._id).populate("village");
    let schemas = await Schema.find({village: userVillage.village});
    res.render("sections/schema.ejs",{user,schemas});
} 
module.exports.budgetDetail = async(req,res)=>{
    let {id} = req.params;
    let bud = await budget.findById(id);
    res.render("sections/budgetDetail.ejs",{bud})
} 
module.exports.projectDetail = async (req, res) => {
    let { id } = req.params;
    let pro = await project.findById(id);
    res.render("sections/projectDetails.ejs", { pro });
}

