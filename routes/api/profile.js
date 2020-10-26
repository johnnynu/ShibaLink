const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route           GET api/profile/me
// @desc            Grabs current user profile
// @access          Private
// Add auth to get() to protect route
router.get("/me", auth, async (req, res) => {
	try {
		// the variable 'profile' finds the userID through the Profile Schema
		// the function, populate(), adds the name and avatar from the User Schema into the variable 'profile'
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate("user", ["name", "avatar"]);

		// Check if profile does not exist
		if (!profile) {
			return res.status(400).json({ msg: "Profile does not exist. " });
		}

		// If profile does exist
		return res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route           POST api/profile
// @desc            Create or update user profile
// @access          Private

router.post("/", auth, async (req, res) => {
	const { location, bio, instagramusername, instagram } = req.body;

	// Build profile object
	const profileFields = {};
	profileFields.user = req.user.id;
	if (location) profileFields.location = location;
	if (bio) profileFields.bio = bio;
	if (instagramusername) profileFields.instagramusername = instagramusername;

	// Build social object
	profileFields.socials = {};
	if (instagram) profileFields.socials.instagram = instagram;

	try {
		// Find profile
		let profile = await Profile.findOne({ user: req.user.id });

		// If profile exists
		if (profile) {
			// Update profile
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}

		// if profile does not exist => create
		profile = new Profile(profileFields);

		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route           GET api/profile
// @desc            Get all profiles
// @access          Public

router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route           GET api/profile/user/:user_id
// @desc            Get a profile by userID
// @access          Public

router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate("user", ["name", "avatar"]);

		if (!profile)
			return res
				.status(400)
				.json({ msg: "No matching profile found for the user specified." });

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == "ObjectId") {
			return res
				.status(400)
				.json({ msg: "No matching profile found for the user specified :(" });
		}
		res.status(500).send("Server Error");
	}
});

module.exports = router;
