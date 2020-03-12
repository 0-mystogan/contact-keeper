const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route      POST api/users
// @desc       Register a user
// @access     Public
router.post(
	'/',
	[
		check('name', 'Please add name')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more  characters'
		).isLength({
			min: 6
		})
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;
		try {
			//with method findOne() we can find User based on any field, we gonna use email
			let user = await User.findOne({ email });
			if (user) {
				//400 - bad request
				res.status(400).json({ msg: 'User already exists' });
			}
			user = new User({
				name,
				email,
				password
			});
			//from bcrypt we use genSalt() to generate Salt
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			await user.save();

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
			//500 - server ERROR
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
