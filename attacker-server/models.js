import mongoose from "mongoose";

const sessionInfoSchema = new mongoose.Schema({
	username: {
		type: String,
	},
	timestamp: {
		type: Date,
		default: Date.now(),
	},
	sessionId: {
		type: String,
	},
	connect_sid: {
		type: String,
	},
	cookie: {
		type: String,
	},
});

export const sessionInfoModel = mongoose.model(
	"session-info",
	sessionInfoSchema
);
