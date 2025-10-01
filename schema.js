const Joi = require("joi");

const adminJoiSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),

    DOB: Joi.date()
        .iso()
        .less('now') // DOB must be in the past
        .required(),

    gender: Joi.string()
        .valid("Male", "Female", "Other")
        .required(),

    phoneNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/) // Indian mobile number
        .required(),

    address: Joi.string()
        .min(5)
        .max(200)
        .required(),

    aadhaar: Joi.string()
        .pattern(/^\d{12}$/) // exactly 12 digits
        .required(),

    email: Joi.string()
    .email({ tlds: { allow: false } }) // standard email validation
    .allow(null, ''), // optional

    voterId: Joi.string()
        .pattern(/^[A-Z0-9]+$/) // only uppercase letters + numbers
        .required(),

    image: Joi.string()
    .uri()
    .allow(null, ''),
    
    village: Joi.string()
        .hex()
        .length(24) // MongoDB ObjectId
        .required(),
    
   
});
const complaintJoiSchema = Joi.object({
    villagerName: Joi.string()
        .min(2)
        .max(100)
        .required(),

    title: Joi.string()
        .min(3)
        .max(200)
        .required(),

    description: Joi.string()
        .min(5)
        .max(1000)
        .required(),

    mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/) // Indian mobile number validation
        .required(),

    date: Joi.date()
        .optional(), // default is set in Mongoose

    village: Joi.string()
        .hex()
        .length(24)
        .required(),

    status: Joi.string()
        .valid("Pending", "In Progress", "Resolved")
        .default("Pending")
});



const userJoiSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(100)
    .required(),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/) // Indian 10-digit number
    .required(),

  village: Joi.string()
    .hex()
    .length(24)
    .required(),

  isApproved: Joi.boolean().default(false),

  image: Joi.string()
    .uri()
    .allow(null, ''),
  role: Joi.string()
    .valid("user", "Admin")
    .default("user"),

  username: Joi.string(),
  password: Joi.string()
  .min(8) // minimum 8 characters
  .max(30) // maximum 30 characters
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
  .required()
  .messages({
    "string.pattern.base": "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 30 characters",
  }),

});
const yojnaSchema = Joi.object({
  title: Joi.string().required(), 
  description: Joi.string().trim().required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().optional(),
  
});
module.exports = {
  userJoiSchema,
  complaintJoiSchema,
  adminJoiSchema,
  yojnaSchema
};
