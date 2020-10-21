const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

const { check, validationResult } = require("express-validator/check");

// @route           GET api/auth
// @desc            Test route
// @access          Public
router.get("/", auth, async (req, res) => {
	try {
		// Get user id without password from database
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route           POST api/auth
// @desc            Authenticate user & grab token
// @access          Public
router.post(
	"/",
	[
		check("email", "Email is required.").isEmail(),
		check("password", "Invalid User Info.").exists()
	],
	async (req, res) => {
		const errors = validationResult(req);

		// Sends back to user errors in correspondence to the check statements
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// Check if user exists
			let user = await User.findOne({ email });

			// If user does not exist, send back an error.
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Entered invalid email or password1." }] });
			}

			// Compare passwords using bcrypt to validate
			// bcrypt.compare(plain password, encrypted password)
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Entered invalid email or password2." }] });
			}

			// Return jsonwebtoken
			const payload = {
				user: {
					id: user.id
				}
			};
			jwt.sign(
				payload,
				config.get("jwtToken"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					// Sending back token
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error!");
		}
	}
);

module.exports = router;
