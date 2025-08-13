// load modules
const express = require('express');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');
const { authenticateUser } = require('../middleware/authUser');

// Create router instance
const router = express.Router();

/**
 * GET /api/users
 * Returns the currently authenticated user with only:
 * id, firstName, lastName, emailAddress
 */
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    if (!user) return res.status(404).end();

    // Explicitly pick allowed fields
    const filteredUserData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    };

    res.status(200).json(filteredUserData);
}));

/**
 * POST /api/users
 * Creates a new user
 * Handles SequelizeValidationError & SequelizeUniqueConstraintError
 */
router.post('/', asyncHandler(async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.location(`/users/${user.id}`).status(201).end();
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;
