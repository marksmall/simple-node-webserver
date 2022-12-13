const express = require('express');
const router = express.Router();

const {
  handleNewUser
} = require('../../controllers/register');

router.route('/')
  .post(handleNewUser);

module.exports = router;
