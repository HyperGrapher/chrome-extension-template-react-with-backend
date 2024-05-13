const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * sanity check
 */
// http://localhost:{port}/api/auth
router.get("/", (req, res, next) => {
	res.json({ message: "Hello Kitty! from auth" });
});


/**
 * Creates new user
 */
// /api/auth/create
router.post("/create", async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		if (!email) {
			res.status(400).json({ message: "Email is required", errType: "email" });
			return;
		}

		// check email is valid using regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: "Email is not valid", errType: "email" });
			return;
		}
		
		if (await db.isUserExistWithEmail(email)) {
			res.status(400).json({ message: "This email already exists", errType: "email" });
			return;
		}

		if (!password) {
			res.status(400).json({ message: "Password is required", errType: "password" });
			return;
		}

		if (password.length < 8) {
			res.status(400).json({ message: "Must be at least 8 characters", errType: "password" });
			return;
		}

		// check password with regex to contain
		// at least 1 uppercase
		// at least 1 lowercase
		// at least one digit
		// at least one special character
		// Has a minimum length of 8
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

		if (!passwordRegex.test(password)) {
			res.status(400).json({ message: "Must contain uppercase, number & special character", errType: "password" });
			return;
		}

		const hashedPassword = bcrypt.hashSync(password, 10);
		const user = await db.createUser({ email, password: hashedPassword });

		if (!user) return res.status(400).json({ message: "Try again later [c:81]", errType: 'email|password'  });

		// create jwt token using jsonwebtoken
		const token = jwt.sign(
			{ userId: user.id, email, active: user.active, active_end: user.active_end },
			process.env.JWT_SECRET
		);

		// must be in this shape for fronend, any change should be reflected
		res.json({ email: user.email, token: token, id: user.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "internal server err [c:99]", errType: 'email|password'  });
	}
});

// /api/auth/login
router.post("/login", async (req, res, next) => {
	try {
		console.log(req.body);

		const email = req.body.email;
		const password = req.body.password;

		if (!email) {
			res.status(400).json({ message: "Email is required", errType: 'email'  });
			return;
		}

		// check if email is valid using regular expression
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: "Email is not valid", errType: 'email'  });
			return;
		}

		if (!password) {
			res.status(400).json({ message: "Password is required", errType: "password" });
			return;
		}

		if (password.length < 8) {
			res.status(400).json({ message: "Must be at least 8 characters", errType: "password" });
			return;
		}

		if (!(await db.isUserExistWithEmail(email))) {
			res.status(400).json({ message: "Wrong credentials", errType: "email|password" });
			return;
		}

		const user = await db.findUser(email);

		// compare password with hashed password
		const isPasswordValid = bcrypt.compareSync(password, user.password);

		if (!isPasswordValid) return res.status(400).json({ message: "Password doesn't match", errType: "password"});

		// create jwt token using jsonwebtoken
		const token = jwt.sign(
			{ userId: user.id, email, active: user.active, active_end: user.active_end },
			process.env.JWT_SECRET
		);

		// must be in this shape for fronend, any change should be reflected
		res.json({ email: user.email, token: token, id: user.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "internal server err [c:155]" });
	}
});

module.exports = router;
