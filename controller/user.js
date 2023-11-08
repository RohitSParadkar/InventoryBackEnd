const User = require("../model/user");
const nodemailer = require("nodemailer");
const verificationToken = require('../model/verificationToken')
const { sendError } = require("./customeError");
const { generateOTP, sendMail,sendWecomeMail, createRandomBytes } = require("../utilities/customMail");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const resetPasswordToken = require("../model/resetPasswordToken");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  //Search for user in database
  const findUser = await User.findOne({ name });
  if (findUser) {
    return sendError(res, "This email is already exists");
  }
  const newUser = new User({
    name,
    email,
    password,
  });

  const OTP = generateOTP();
  const newVarificationToken = new verificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newVarificationToken.save();
  await newUser.save();
  res.send(newUser);
  sendMail(OTP, newUser.email);
};

//signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, "Email or password is missing");
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found!");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "email/password does not match");
  //if user mathched
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60, // one hour expire
  });
  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user._id, token },
  });
};

///varifiy  email
exports.emailVarification = async (req, res) => {
  const { userId, otp } = req.body
  if (!userId || !otp.trim()) return sendError(res, "Invalid request");
  if (!isValidObjectId(userId))
    if (!userId || !otp.trim()) return sendError(res, "Invalid user id");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found");

  if (user.varified) return sendError(res, "account already verified");

  const token = await verificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "Sorry user not found");
  
 const isMatched = await token.compareToken(otp)
  if (!isMatched) return sendError(res, "Please enter the valid otp");


 

  user.varified = true;
  await user.save();
  sendWecomeMail();
  res.json({success:true,message:'User Successfully verified',user:{
     name:user.name,
     email : user.email,
     id:user._id
  }})
  console.log("emailVarification")
};

//forgot password 
exports.forgotPassword = async(req,res)=>{
  const {email} =req.body;
  if(!email) return sendError(res, "Please enter valid email")
  
  const user = await User.findOne({email})
  if(!user) sendError(res, "User not found")

  const token = resetPasswordToken.findOne({owner:user._id})
  console.log(token)
  if(token) return sendError(res, "await for one hour")

  //random token 
  const newToken = await createRandomBytes()
  console.log(newToken)
  const resetToken =  new resetPasswordToken({owner:user._id,newToken})
  await resetToken.save()
  sendForgotMail(`http://localhost:3000/resetPassword?token=${newToken}&id=${user._id}`) //react application for 
  res.json({success:true,message:'Password reset successfully send to your email'})
}