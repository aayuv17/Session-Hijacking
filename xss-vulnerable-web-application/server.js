import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
const session = require("express-session");
const cookieParser = require("cookie-parser");
import { router } from "./controllers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("combined"));
app.use(
	session({
		secret: "s3cr3t",
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60, httpOnly: false },
		resave: false,
	})
);
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("", router);

mongoose
	.connect("mongodb://localhost:27017/users", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Successfully connected to mongodb"))
	.catch((err) => console.log(err));

export const start = () => {
	app.listen(3000);
	console.log("Running at port 3000");
};
