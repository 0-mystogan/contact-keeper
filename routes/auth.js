const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route      GET api/auth
// @desc       Get logged in user
// @access     Private
router.get('/', auth, async (req, res) => {
	try {
		//select("-password") -> we dont wont to return password
		const user = await User.findById(req.user.id).select("-password")
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route      POST api/auth
// @desc       Auth user & get token
// @access     Public
router.post(
	'/',
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
			//if there is not user with that email
			//return status(400) in json with message "Invalid Credentials"
			if (!user) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}
			//If users exists we need to check password
			//using bcrypt.compare method
			//bcrypt.compare(planePassword, and users password thats stored in DB)
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}

			//payload is an object I wonna send in the token
			const payload = {
				user: {
					//with user.id we can get specific data
					id: user.id
				}
			};
			//jwt.sing(1.payload, 2.secret{never put secret directly in here}, 3.object of options)
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					//expiresIn: we can put our token to expire to 3600sec(its hour)
					expiresIn: 360000
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
