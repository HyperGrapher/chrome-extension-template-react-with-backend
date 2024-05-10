const express = require("express");
const app = express();
const routes = require("./routes/main");
const authRoute = require("./routes/auth");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
dotenv.config();

/**
 *  In the header file of the request,
 *  include Content-Type: application/json
 */

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(helmet())

// http://localhost:3000/api/
app.use("/api/", routes);
app.use("/api/auth/", authRoute);

app.listen(process.env.PORT || "5656", () => {
	console.log(`Server is running on port: ${process.env.PORT || "5656"}`);
});
