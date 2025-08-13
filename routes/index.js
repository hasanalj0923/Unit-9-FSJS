// load modules
const express = require('express');
const users = require('./users');
const courses = require('./courses');

// create a router instance
const router = express.Router();

// mount users and courses routes on /api path
router.use('/users', users);
router.use('/courses', courses);

// export the router
module.exports = router;
