const User = require('../Model/superadminloginmodel');
// const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: ' Superadmin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: ' Error while registering', error: err.message });
  }
};
