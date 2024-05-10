const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// first rename ".env.example" to ".env"  
const pool = mysql.createPool({
	connectionLimit: 10,
	password: process.env.DB_PASSWORD,
	user: process.env.DB_USERNAME,
	database: process.env.DB_DATABASE,
	host: "localhost",
	port: "3306",
});

let db = {};

db.findUser = (email) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM users where email = ?`, [email], (err, results) => {
			if (err) {
				return reject(err);
			}
			// might be better to limit query to 1
			return resolve(results[0]);
		});
	});
};

db.findUserById = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM users where id = ?`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			// might be better to limit query to 1
			return resolve(results[0]);
		});
	});
};

db.createUser = (userData) => {
	const { email, password } = userData;
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (error, results, fields) => {
			if (error) {
				reject(error);
				return;
			}
			// users table should have an auto-incrementing id column
			const userId = results.insertId;
			// Fetch the created user
			pool.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
				if (error) {
					reject(error);
					return;
				}
				console.log(results[0]);
				const createdUser = results[0];
				resolve(createdUser);
			});
		});
	});
};

db.isUserExistWithEmail = (email) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM users where email = ?`, [email], (err, results) => {
			if (err) {
				return reject(err);
			}
			if (results.length === 0) {
				return resolve(false);
			}
			return resolve(true);
		});
	});
};

module.exports = db;
