const mongoose = require("mongoose");
const { model } = require("./User");

const ProfileSchema = mongoose.Schema({
	// reference 'user' to the User Schema
	user: {
		// Grabs the id from the User in the database
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	location: {
		type: String
	},
	bio: {
		type: String
	},
	instagramusername: {
		type: String
	},
	socials: {
		instagram: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
