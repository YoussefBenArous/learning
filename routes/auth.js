const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../modles/users/user');
const {getUser} = require('../controlleur/usercontrolleur');
const {getUserBuId} = require('../controlleur/usercontrolleur');
const authcontrolleur  = require('../controlleur/authcontrolleur');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),

    ],
    authcontrolleur.register,
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, role } = req.body;
        try {
            let user = await User.findOne({ email });
            
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            user = new User({
                name,
                email,
                password,
                role
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            req.session.userId = user._id;
            req.session.userRole = user.role;
            
            res.json({ msg: 'User registered and logged in' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send(' error to Register');
        }
    }
);
// @route   POST /api/auth/login
// @desc    Authenticate user and start session
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            req.session.userId = user._id;
            req.session.userRole = user.role;
            res.json({ msg: 'User logged in' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);
// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: 'Not authenticated' });
    }
    User.findById(req.session.userId)
        .select('-password')
        .then(user => res.json(user))
        .catch(err => {
            console.error(err.message);
            res.status(500).send('Server error');
        });
});
// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out, please try again.');
        }
        res.json({ msg: 'Logged out successfully' });
    });
});
//get all user
router.get('/getUser',
    getUser
);
//get user by id 
router.get('/getUserBuId',
    getUserBuId
)
module.exports = router;