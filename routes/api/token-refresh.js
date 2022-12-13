const express = require('express');
const router = express.Router();

const { handleTokenRefresh } = require('../../controllers/refresh-token');

router.route('/')
  .get(handleTokenRefresh);

module.exports = router;
