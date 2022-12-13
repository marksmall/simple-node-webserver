const verifyRoles = (...roles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = [...roles];
    console.log('ROLES: ', rolesArray);
    console.log('REQUEST ROLES: ', req.roles);

    const result = req.roles.map(role => rolesArray.includes(role)).find(role => role === true);
    console.log('RESULT: ', result);

    if (!result) {
      return res.sendStatus(401);
    }

    next();
  }
};

module.exports = verifyRoles;
