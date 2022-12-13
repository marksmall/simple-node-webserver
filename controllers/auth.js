const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const existingUser = await User.findOne({ username: user }).exec();
  if (!existingUser) {
    return res.sendStatus(401); // Unathorized
  }

  // check password
  const doesPasswordMatch = await bcrypt.compare(pwd, existingUser.password);
  if(doesPasswordMatch) {
    // Get the role codes for the existing user.
    const roles = Object.values(existingUser.roles);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: existingUser.username,
          roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );

    const refreshToken = jwt.sign(
      { username: existingUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '120s' }
    );

    // Put refresh token into database against current user.
    // await User.findOneAndUpdate({ refreshToken }).exec();
    existingUser.refreshToken = refreshToken;
    const result = await existingUser.save();
    console.log('SAVED USER: ', result);

    // Set http only cookie, so it isn't available to JavaScript, while not 
    // 100% secure, it is much more secure than a cookie JavaScrpt can access
    // or as part of the json response.
    res.cookie(
      'my_jwt',
      refreshToken,
      { 
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 120 * 1000
      }
    );

    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unathorized
  }
};

module.exports = { handleLogin }