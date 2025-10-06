const village = require("../model/village.js");
const User = require("../model/user.js");
const project = require("../model/project.js");
const budget = require("../model/budget.js");
const Complaint = require("../model/complaint.js");
const Schema = require("../model/schema.js");
const { route } = require("./admin.js");
const Comment = require("../model/comments.js");
const path = require("path");




module.exports.signup = async (req, res) => {
    let data = await village.find({});
    res.render("sections/signupUser.ejs", { data });
}
module.exports.signupPost = async (req, res) => {
    let { fullname, mobile, village, email, username, password } = req.body;
    const newUser = new User({ fullname, mobile, village, email, image: req.file.path, username, isApproved: false });
    await User.register(newUser, password);
    req.flash("success", "You can access after approval from you Gram-pradhan");
    res.redirect("/user/login");

}
module.exports.login = (req, res) => {
    res.render("sections/loginUser.ejs");
}
module.exports.loginPost = async (req, res) => {
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
module.exports.forgetPass = (req, res) => {
    res.render("sections/forgetPass.ejs");
}
module.exports.forgetPassPost = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
        req.flash("error", "No account with that email exists.");
        return res.redirect("/User/forgot-password");
    }

    // Step 3: Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    await user.save();

    const resetURL = `http://${req.headers.host}/user/reset-password/${token}`;

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

    req.flash("success", "Password reset link sent to your email.");
    res.redirect("/user/login");
}
module.exports.resetPass = async (req, res) => {
    const user = await User.findOne({
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
    const user = await User.findOne({
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
    res.redirect("/user/login");
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
module.exports.dashboard = async (req, res) => {
    let user = await User.findById(req.user._id).populate("village");
    res.render("sections/dashboard.ejs", { user });
}
module.exports.project = async (req, res) => {
    let user = await User.findById(req.user._id).populate("village");
    const userVillage = await req.user.populate("village");
    let projects = await project.find({ village: userVillage.village });
    res.render("sections/project.ejs", { projects, user });
}

module.exports.budget = async (req, res) => {
    let budgets = await budget.find({});
    let user = await User.findById(req.user._id).populate("village");
    res.render("sections/budget.ejs", { budgets, user });
}
module.exports.complaint = async (req, res) => {
    let user = await User.findById(req.user._id).populate("village");
    let data = await village.find({ name: user.village.name });
    res.render("sections/raiseComplaint.ejs", { user, data });
}
module.exports.complaintPost = async (req, res) => {

    let { complaint: complaintData } = req.body;
    const newComplaint = new Complaint({ ...complaintData })
    await newComplaint.save();
    req.flash("success", "Complaint submitted! We appreciate your feedback.");
    res.redirect("/user/dashboard");
}
module.exports.schema = async (req, res) => {
    const userVillage = await req.user.populate("village");
    let user = await User.findById(req.user._id).populate("village");
    let schemas = await Schema.find({ village: userVillage.village });
    res.render("sections/schema.ejs", { user, schemas });
}
module.exports.budgetDetail = async (req, res) => {
    let { id } = req.params;
    let bud = await budget.findById(id);
    res.render("sections/budgetDetail.ejs", { bud })
}
module.exports.projectDetail = async (req, res) => {
    let { id } = req.params;
    let pro = await project.findById(id)
        .populate({
            path: "comments", 
            populate: {
                path: "user"
            }
        });
    
    res.render("sections/projectDetails.ejs", { pro });
}

module.exports.comment = async (req, res) => {
    let { id } = req.params;
    let { description } = req.body;
    let pro = await project.findById(id);
    if (req.user.role != "Admin") {
        const newComment = new Comment({ description, user: req.user._id });
        await newComment.save();
        pro.comments.push(newComment);
        pro.save();
        return res.redirect(`/project/${id}/comment`);
    }


    res.send("hii");
}