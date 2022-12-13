const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleTokenRefresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.my_jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.my_jwt;

  const existingUser = await User.findOne({ refreshToken }).exec();
  if (!existingUser) {
    return res.sendStatus(403); // Forbidden
  }

  // Evaluate refresh token.
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err | existingUser.username !== decoded.username) {
        return res.sendStatus(403);
      }

      const roles = Object.values(existingUser.roles);

      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            roles
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' },
      );

      res.json({ accessToken });
    }
  );
};

module.exports = { handleTokenRefresh }