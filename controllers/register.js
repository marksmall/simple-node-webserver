const bcrypt = require('bcrypt');

const User = require('../models/User');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check for duplicate usernames.
  const doesUsernameExist = await User.findOne({ username: user }).exec();
  if (doesUsernameExist) {
    return res.sendStatus(409); // Conflict
  }

  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(pwd, 10);
    // Store new user
    const result = await User.create({
      username: user,
      password: hashedPassword,
    });

    console.log('Create User Result: ', result);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser }