const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header("x-auth-token");

	// Check if token is not in database
	if (!token) {
		return res
			.status(401)
			.json({ msg: "Authorization declined due to invalid token." });
	}

	// Verify token
	try {
		const decoded = jwt.verify(token, config.get("jwtToken"));
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Invalid Token" });
	}
};
