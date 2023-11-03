const User = require("../model/user");
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  //Search for user in database
  const findUser = await User.findOne({ name });
  if (findUser) {
    res
      .status(400)
      .json({ success: false, error: "This email is already exists" });
  }
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  res.send(newUser);
};
