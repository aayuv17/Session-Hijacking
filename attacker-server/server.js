import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { router } from "./controllers";

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use("", router);

mongoose
	.connect("mongodb://localhost:27017/attacker", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Successfully connected to mongodb"))
	.catch((err) => console.log(err));

export const start = () => {
	app.listen(8000);
	console.log("Running at port 8000");
};
