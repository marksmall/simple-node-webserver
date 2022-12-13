const User = require('../models/User');

const handleLogout = async (req, res) => {
  // TODO: on client. also delete the accessToken.
  const cookies = req.cookies;

  if (!cookies?.my_jwt) {
    return res.sendStatus(204); // No content
  }

  const refreshToken = cookies.my_jwt;

  const existingUser = await User.findOne({ refreshToken }).exec();
  if (!existingUser) {
    res.clearCookie(
      'my_jwt',
      {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }
    );

    return res.sendStatus(204); // No content
  }

  // Delete refresh token in dbase
  existingUser.refreshToken = '';
  const result = await existingUser.save();
  console.log('SAVED USER: ', result);

  res.clearCookie(
    'my_jwt',
    {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    }
  );

  res.sendStatus(204);
};

module.exports = { handleLogout }