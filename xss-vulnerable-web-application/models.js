import mongoose from "mongoose";

const userAuth = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	sessionID: {
		type: String,
		default: "",
	},
});

const userDetails = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	posts: {
		type: [String],
	},
	bio: {
		type: String,
		default: "",
	},
});

const postDetails = new mongoose.Schema({
	username: {
		type: String,
	},
	post: {
		type: String,
	},
	timestamp: {
		type: Date,
		default: Date.now(),
	},
});

export const userAuthModel = mongoose.model("user-auth", userAuth);
export const userDetailsModel = mongoose.model("user-details", userDetails);
export const postDetailsModel = mongoose.model("post-details", postDetails);
