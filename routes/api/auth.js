const express = require('express');
const router = express.Router();

const { handleLogin } = require('../../controllers/auth');

router.route('/')
  .post(handleLogin);

module.exports = router;
