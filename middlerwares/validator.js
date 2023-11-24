const { check, validationResult } = require("express-validator");

exports.validateUser = [
  //--------------------------------email validation
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing! ")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be in 8-20 character"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (!error.length) return next();

  res.status(400).json({ sucess: false, error: error[0].msg });
};
