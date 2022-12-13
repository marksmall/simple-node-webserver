const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization ?? req.headers.Authorization;
  console.log('AUTH HEADER: ', authHeader);

  if (!authHeader?.startsWith('Bearer')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1]; // Get the Bearer token.
  console.log('TOKEN: ', token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log('VERIFICATION ERROR: ', err);
    if (err) {
      return res.sendStatus(403); // invalid token.
    }

    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;

    next();
  });
};

module.exports = verifyJWT;
