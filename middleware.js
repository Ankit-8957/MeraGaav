const Project = require("./model/project");
const {adminJoiSchema,userJoiSchema , complaintJoiSchema , yojnaSchema} = require("./schema.js");
const ExpressError = require("./ExpressError.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.flash("error","You are not logged in");
        return res.redirect("/");
    }
    next();
}

module.exports.asyncWrap = function(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(err => next(err));
  }
};
module.exports.validateAdmin = (req,res,next)=>{
  let {error} = adminJoiSchema.validate(req.body.admin);
    if(error){
        throw new ExpressError(400,error)
    }else{
      next();
    }
 }
module.exports.validateUser = (req,res,next)=>{
  let {error} = userJoiSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
      next();
    }
 }
module.exports.validateComplaint = (req,res,next)=>{
  let {error} = complaintJoiSchema.validate(req.body.complaint);
    if(error){
        throw new ExpressError(400,error)
    }else{
      next();
    }
 }
module.exports.validateSchema = (req,res,next)=>{
  let {error} = yojnaSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
      next();
    }
 }