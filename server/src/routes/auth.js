const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * sanity check
 */
// http://localhost:3000/api/auth
router.get("/", (req, res, next) => {
	res.json({ message: "Hello Kitty! from auth" });
});

/**
 * Get single post with ID
 */
// http://localhost:3000/api/posts/5
router.get("/user/:id", async (req, res, next) => {
	try {
		let result = await db.single(req.params.id);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

/**
 * Creates new user
 */
// http://localhost:3000/api/auth/create
router.post("/create", async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		if (!email) {
			res.status(400).json({ message: "email is required" });
			return;
		}

		// check email is valid using regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: "email is not valid" });
			return;
		}

		if (!password) {
			res.status(400).json({ message: "password is required" });
			return;
		}

		if (password.length < 8) {
			res.status(400).json({ message: "password must be at least 8 characters" });
			return;
		}

		// check password with regex to contains
		// at least 1 uppercase
		// at least 1 lowercase
		// at least one digit
		// at least one special character
		// Has a minimum length of 8
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

		if (!passwordRegex.test(password)) {
			res.status(400).json({ message: "password must contain 1 uppercase letter and 1 special character" });
			return;
		}

		if (await db.isUserExistWithEmail(email)) {
			res.status(400).json({ message: "user already exists" });
			return;
		}

		const hashedPassword = bcrypt.hashSync(password, 10);
		const user = await db.createUser({ email, password: hashedPassword });

		if (!user) return res.status(400).json({ message: "error" });

		// create jwt token using jsonwebtoken
		const token = jwt.sign(
			{ userId: user.id, email },
			process.env.JWT_SECRET
		);

		// must be in this shape for fronend, any change should be reflected
		res.json({ email: user.email, token: token, id: user.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "internal server err [c:99]" });
	}
});

router.post("/login", async (req, res, next) => {
	try {
		console.log(req.body);

		const email = req.body.email;
		const password = req.body.password;

		if (!email) {
			res.status(400).json({ message: "email is required" });
			return;
		}

		// check email is email using regular expression
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: "email is not valid" });
			return;
		}

		if (!password) {
			res.status(400).json({ message: "password is required" });
			return;
		}

		if (password.length < 8) {
			res.status(400).json({ message: "password must be at least 8 characters" });
			return;
		}

		if (!(await db.isUserExistWithEmail(email))) {
			res.status(400).json({ message: "wrong credentials" });
			return;
		}

		const user = await db.findUser(email);

		// compare password with hashed password
		const isPasswordValid = bcrypt.compareSync(password, user.password);

		if (!isPasswordValid) return res.status(400).json({ message: "credentials don't match" });

		// create jwt token using jsonwebtoken
		const token = jwt.sign(
			{ userId: user.id, email },
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
