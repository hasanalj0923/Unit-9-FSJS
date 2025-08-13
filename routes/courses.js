// load modules
const express = require('express');
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');
const { authenticateUser } = require('../middleware/authUser');

// construct router instance
const router = express.Router();

// GET /api/courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        }]
    });

    res.status(200).json(courses);
}));

// GET /api/courses/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        }]
    });

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
}));

// POST /api/courses
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    req.body.userId = user.id;

    try {
        const course = await Course.create(req.body);
        res.location(`/courses/${course.id}`).status(201).end();
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// PUT /api/courses/:id
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.userId !== user.id) return res.status(403).json({ message: 'Forbidden' });

    try {
        await course.update(req.body);
        res.status(204).end();
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// DELETE /api/courses/:id
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.userId !== user.id) return res.status(403).json({ message: 'Forbidden' });

    try {
        await course.destroy();
        res.status(204).end();
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
