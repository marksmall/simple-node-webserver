const express = require('express');

const verifyRoles = require('../../middleware/verify-roles');
const ROLES = require('../../config/roles');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../../controllers/employees');

const router = express.Router();


router.route('/')
  .get(getAllEmployees)
  .post(verifyRoles(ROLES.admin, ROLES.editor), createEmployee)
  .put(verifyRoles(ROLES.admin, ROLES.editor), updateEmployee)
  .delete(verifyRoles(ROLES.admin), deleteEmployee);

router.route('/:id')
  .get(getEmployee);

module.exports = router;
