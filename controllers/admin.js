const { Resend } = require("resend");
const passport = require("passport");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const village = require("../model/village.js");
const admin = require("../model/admin.js");
const User = require("../model/user.js");
const Complaints = require("../model/complaint.js");
const Project = require("../model/project.js");
const budget = require("../model/budget.js");
const Schema = require("../model/schema.js");
const ExpressError = require("../ExpressError.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.adminSignup = async (req, res) => {
    let data = await village.find({});
    res.render("sections/signup.ejs", { data });
}
module.exports.adminSignupPost = async (req, res) => {
    let { username, password, admin: adminDetails } = req.body;
    const newAdmin = new admin({
        ...adminDetails,
        username,
        image: req.file.path
    });
    await admin.register(newAdmin, password);
    req.flash("success", "you are signed up now.");
    res.redirect("/");
}
module.exports.login = (req, res) => {
    res.render("sections/loginAdmin.ejs");
}

module.exports.loginPost = async (req, res) => {
    try {
        let { aadhaar } = req.body;

        await admin.find({ aadhaar: aadhaar });
        if (req.user.aadhaar !== aadhaar) {
            req.flash("error", "Wrong aadhar number");
            return res.redirect("/Admin/login");
        }

        req.flash("success", "You are logged in !!!!");
        res.redirect("/Admin/dashboard");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/Admin/login");
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
    let user = await admin.findById(req.user._id).populate("village");

    res.render("sections/dashboard.ejs", { user });
}

module.exports.manageUser = async (req, res) => {
    const userVillage = await req.user.populate("village");
    let user = await admin.findById(req.user._id).populate("village");
    let Users = await User.find({ village: userVillage.village }).populate("village");
    res.render("sections/manageUser.ejs", { Users, user });
}

module.exports.complaint = async (req, res) => {
    const userVillage = await req.user.populate("village");
    let user = await admin.findById(req.user._id).populate("village");
    let complaints = await Complaints.find({ village: userVillage.village });
    res.render("sections/complaints.ejs", { complaints, user });
}

module.exports.project = async (req, res) => {
    const userVillage = await req.user.populate("village");
    let projects = await Project.find({ village: userVillage.village }).populate("village");
    // console.log(projects);
    let user = await admin.findById(req.user._id).populate("village");
    res.render("sections/project.ejs", { projects, user });
}

module.exports.newProject = async (req, res) => {
    const userVillage = await req.user.populate("village");
    let data = await village.find({ name: userVillage.village.name });
    res.render("sections/newProject.ejs", { data });
}

module.exports.newProjectPost = async (req, res) => {
    let { project } = req.body;
    if (!project) {
        throw new ExpressError(400, "Please enter valid data");
    }

    // console.log(result)
    if (project.milestones) {
        if (!Array.isArray(project.milestones)) {
            project.milestones = [project.milestones];
        }
        project.milestones = project.milestones.map(m => ({
            name: m,
            completed: false
        }));
    }
    let images = [];
    if (req.files && req.files.length > 0) {
        images = req.files.map(f => ({
            filename: f.filename,
            url: f.path
        }));
    }
    project.image = images;
    project.admin = req.user._id;

    let newProject = new Project(project);
    await newProject.save();
    req.flash("success", "New project created successfully!");
    res.redirect("/Admin/project");
}

module.exports.budget = async (req, res) => {
    let budgets = await budget.find({});
    let user = await admin.findById(req.user._id).populate("village");
    res.render("sections/budget.ejs", { budgets, user });
}

module.exports.schema = async (req, res) => {
    const uservillage = await req.user.populate("village");
    let user = await admin.findById(req.user._id).populate("village");
    let schemas = await Schema.find({ village: uservillage.village }).populate("village");

    res.render("sections/schema.ejs", { user, schemas });
}

module.exports.newSchema = (req, res) => {
    res.render("sections/newSchema.ejs");
}

module.exports.newSchemaPost = async (req, res) => {
    const uservillage = await req.user.populate("village");
    let { title, description, startDate, endDate, } = req.body;
    const newSchema = new Schema({ title, description, startDate, endDate, village: uservillage.village });
    await newSchema.save();
    res.redirect("/Admin/schema");
}

module.exports.editSchema = async (req, res) => {
    let { id } = req.params;
    const schema = await Schema.findById(id);
    res.render("sections/editSchema.ejs", { schema });
}

module.exports.editSchemaPut = async (req, res) => {
    let { id } = req.params;
    let { title, description, startDate, endDate } = req.body;
    await Schema.findByIdAndUpdate(id, { title, description, startDate, endDate });
    req.flash("success", "Your schema has edited successfully");
    res.redirect("/Admin/schema")
}

module.exports.deleteSchema = async (req, res) => {
    let { id } = req.params;
    await Schema.findByIdAndDelete(id);
    req.flash("success", "Your schema has deleted successfull");
    res.redirect("/Admin/schema")
}

module.exports.budgetDetails = async (req, res) => {
    let { id } = req.params;
    let bud = await budget.findById(id);
    res.render("sections/budgetDetail.ejs", { bud })
}

module.exports.projectDetails = async (req, res) => {
    let { id } = req.params;
    let pro = await Project.findById(id).populate("village");
    res.render("sections/projectDetails.ejs", { pro });
}
module.exports.forgetPass = (req, res) => {
    res.render("sections/forgetPass.ejs");
}
module.exports.forgetPassPost = async (req, res) => {
    const { email } = req.body;
    const user = await admin.findOne({ email });


    if (!user) {
        req.flash("error", "No account with that email exists.");
        return res.redirect("/Admin/forgot-password");
    }

    // Step 3: Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    await user.save();

    // // Step 4: Send email with reset link
    // const transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS
    //     }
    // });

    const resetURL = `http://${req.headers.host}/Admin/reset-password/${token}`;

try {
    const resend = new Resend(process.env.API_KEY);

    await resend.emails.send({
        from: `Mera Gaav <onboarding@resend.dev>`,
        to: process.env.EMAIL_USER,
        subject: "Mera Gaav | Password Reset",
        html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>

      <a href="${resetURL}" 
   style="display:inline-block;
          padding:12px 20px;
          background-color:#007BFF;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;">
   Reset Password
</a>
    `
    });
      console.log("Email sent successfully!");
} catch (err) {
      console.error("Failed to send email:", err);
}

    
    //     const mailOptions = {
    //         from: process.env.EMAIL,
    //         to: user.email,
    //         subject: "Mera Gaav | Password Reset",
    //         html: `
    //       <h3>Password Reset Request</h3>
    //       <p>Click the link below to reset your password. This link will expire in 1 hour.</p>

    //       <a href="${resetURL}" 
    //    style="display:inline-block;
    //           padding:12px 20px;
    //           background-color:#007BFF;
    //           color:#ffffff;
    //           text-decoration:none;
    //           border-radius:6px;
    //           font-weight:bold;">
    //    Reset Password
    // </a>
    //     `
    //     };

    //     await transporter.sendMail(mailOptions);
    req.flash("success", "Password reset link sent to your email.");
    res.redirect("/Admin/login");
}
module.exports.resetPass = async (req, res) => {
    const user = await admin.findOne({
        resetToken: req.params.token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("error", "Token is invalid or has expired.");
        return res.redirect("/Admin/forgot-password");
    }

    res.render("sections/resetPass.ejs", { token: req.params.token });
}
module.exports.resetPassPost = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Find admin by reset token and check expiry
    const user = await admin.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() } // token not expired
    });

    if (!user) {
        req.flash("error", "Token is invalid or expired.");
        return res.redirect("/Admin/forgot-password");
    }

    // Set new password using Passport-Local Mongoose
    await user.setPassword(password);

    // Remove token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save(); // save document with new hashed password

    req.flash("success", "Password reset successfully! You can now login.");
    res.redirect("/Admin/login");
}
module.exports.milestone = async (req, res) => {
    try {
        let { proId, mileId } = req.params;

        let project = await Project.findById(proId);
        let milestone = project.milestones.id(mileId);
        if (req.user && req.user._id.equals(project.admin._id)) {
            if (milestone && milestone.completed === false) {
                milestone.completed = true;
                await project.save();
                return res.redirect(`/Admin/project/${proId}/projectDetail`);
            }

        } else {
            req.flash("error", "You don't have permission to change");
            return res.redirect(`/Admin/project/${proId}/projectDetail`);
        }

        res.redirect(`/Admin/project/${proId}/projectDetail`);
    } catch (err) {
        console.error(err);
        res.send("Error updating milestone");
    }
}

module.exports.updateComplaint = async (req, res) => {
    let { id } = req.params;
    let updateValue = req.body;
    if (updateValue.status === "Resolved") {
        await Complaints.findByIdAndDelete(id);
    } else {
        await Complaints.findByIdAndUpdate(id, updateValue);
    }

    res.redirect("/Admin/complaints");
}

module.exports.approveUser = async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(id, { isApproved: true });
    res.redirect("/Admin/manageUser");
}

module.exports.deleteUser = async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/Admin/manageUser");
}

module.exports.userDetails = async (req, res) => {
    let { id } = req.params;
    let detail = await User.findById(id).populate("village");
    console.log(detail);

    res.render("sections/userDetails.ejs", { detail });
}