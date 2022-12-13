const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (!employees) { 
    res.status(204).json({ message: 'No employees found.' });
  }

  res.json(employees);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({
      message: 'ID of user required.'
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    res.status(400).json({ message: `Employee with ID: ${req.body.id} not found.`});
  }

  res.json(employee);
};

const createEmployee = async (req, res) => {
  if (!req?.body?.firstName || !req?.body?.surname) {
    return res.status(400).json({
      message: 'First and last names are required. '
    });
  }

  try {
    const result = await Employee.create({
      firstName: req.body?.firstName,
      surname: req.body?.surname,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: 'ID of user required.'
    });
  }

  const existingEmployee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!existingEmployee) {
    return res.status(204).json({ message: `Employee with ID: ${req.body.id} not found.`});
  }

  if (req.body?.firstName) {
    existingEmployee.firstName = req.body.firstName;
  }

  if (req.body?.surname) {
    existingEmployee.surname = req.body.surname;
  }

  const result = await existingEmployee.save();
  console.log('Updated Employee: ', result);

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: 'ID of user required.'
    });
  }

  const existingEmployee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!existingEmployee) {
    return res.status(400).json({ message: `Employee with ID: ${req.body.id} not found.`});
  }

  const result = await Employee.deleteOne({ _id: req.body.id });
  console.log('Deleted Employee: ', result);

  res.json(result);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
