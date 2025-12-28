const express = require('express');
const router = express.Router();

const User = require('../../models/user');
const authController = require('../controller/authController');

// test create user
router.post('/test-created', async (req, res) => {
    try {
        let newuser = await new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await newuser.save();
        res.status(201).json({ message: 'user created', data: newuser });
    } catch (err) {
        res.status(500).json({ message: 'error creating user', error: err.message });
    }
});

// laby
router.get('/lobby', authController.lobbyPage);

module.exports = router;
