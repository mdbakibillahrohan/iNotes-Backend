const express = require("express");
const router = express.Router();
const User = require('../models/Users')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUsers = require('../middleware/fetchuser');

const JWT_SECRET = "rohan"
// Route-1:  Create user using POST "/api/auth/createUser" doesn't require authentication 
router.post('/createUser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors return bad request and respond the errors
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check the user  already exist or not 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ err: "Sorry the email address already exist" })
        }
        const salt = await bcrypt.genSalt();
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        if (user) {
            const data = {
                user: {
                    id: user.id
                }
            }
            authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken });
        }


        // catch error 
    } catch (error) {
        console.log(error.message);
        res.send("Something went wrong")
    }
})


// Route-2: Authenticate a user Using POST "/api/auth/login" doesn't require authentication 
router.post('/login', [
    body('email', "Please enter a valid email").isEmail(),
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please enter the right credentials" });
        }
        if (user) {
            // Comparing password using bcrypt method
            let comaparePassword = bcrypt.compare(password, user.password);
            if (!comaparePassword) {
                return res.status(400).json({ error: "Please enter the right credentials" });
            }
            if (comaparePassword) {
                data = {
                    user: {
                        id: user.id
                    }
                }

                const authToken = jwt.sign(data, JWT_SECRET);
                res.json({ authToken });
            }
        }
    } catch (error) {
        res.json(error.message)
    }

})

// Route-3: Get the logged in user information using POST "/api/auth/getuser" required authenticate

router.post('/getuser', fetchUsers, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        res.json(error.message);
    }
})
module.exports = router;