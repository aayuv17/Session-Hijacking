import express from "express";
import { userAuthModel } from "./models";
import { userDetailsModel } from "./models";
import { postDetailsModel } from "./models";

export const router = express.Router();
var userSession;

router.route("/").get(async (req, res) => {
	res.render("pages/index", {
		message: "Welcome to the Application",
	});
});

router
	.route("/login")
	.get(async (req, res) => {
		res.render("pages/login");
	})
	.post(async (req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		var query = await userAuthModel
			.findOne({
				username: username,
				password: password,
			})
			.exec();
		if (query) {
			userSession = req.session;
			userSession.username = username;
			res.cookie("sessionID", req.sessionID);
			res.cookie("username", username);
			await userAuthModel.findOneAndUpdate(
				{ username: username },
				{ sessionID: req.sessionID }
			);
			res.redirect("/" + username + "?default=5");
		} else
			res.send({
				message: "Authentication failed",
			});
	});

router
	.route("/signup")
	.get(async (req, res) => {
		res.render("pages/register");
	})
	.post(async (req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		await userAuthModel.create({
			username: username,
			password: password,
		});
		await userDetailsModel.create({
			username: username,
		});
		res.redirect("/login");
	});

router
	.route("/:username")
	.get(async (req, res) => {
		if (userSession) {
			const authenticateUser = await userAuthModel
				.findOne({ username: req.params.username })
				.exec();
			if (req.session.id === authenticateUser.sessionID) {
				const query = await postDetailsModel.find({}).exec();
				var noOfPosts = req.query.default;
				if (noOfPosts > query.length) noOfPosts = query.length;
				res.render("pages/allPosts", {
					username: req.session.username,
					posts: query,
					noOfPosts: noOfPosts,
				});
			} else {
				res.redirect(
					"/" +
						req.params.username +
						"/userProfile?context=" +
						req.params.username
				);
			}
		} else {
			res.redirect("/login");
		}
	})
	.post(async (req, res) => {
		console.log("Request body", req.body.noOfPosts);
		if (userSession) {
			res.redirect(
				"/" + req.params.username + "?default=" + req.body.noOfPosts
			);
		} else {
			res.redirect("/login");
		}
	});

router.route("/:username/userProfile").get(async (req, res) => {
	if (userSession) {
		console.log(req.query);
		const authenticateUser = await userAuthModel
			.findOne({ username: req.params.username })
			.exec();
		if (req.session.id !== authenticateUser.sessionID) {
			const query = await userDetailsModel
				.find({ username: req.params.username })
				.exec();
			const posts = query[0].posts;
			var userPosts = [];
			for (var i = 0; i < posts.length; i++) {
				var temp = await postDetailsModel
					.findOne({
						_id: posts[i],
					})
					.exec();
				userPosts.push(temp);
			}
			res.render("pages/userProfile", {
				username: req.params.username,
				bio: query[0].bio,
				posts: userPosts,
			});
		} else {
			res.redirect("/" + req.params.username + "/myProfile");
		}
	} else {
		res.redirect("/login");
	}
});

router.route("/:username/myProfile").get(async (req, res) => {
	if (userSession) {
		const authenticateUser = await userAuthModel
			.findOne({ username: req.params.username })
			.exec();
		if (req.session.id === authenticateUser.sessionID) {
			const query = await userDetailsModel
				.find({ username: req.params.username })
				.exec();
			const posts = query[0].posts;
			var userPosts = [];
			for (var i = 0; i < posts.length; i++) {
				var temp = await postDetailsModel
					.findOne({
						_id: posts[i],
					})
					.exec();
				userPosts.push(temp);
			}
			console.log(userPosts);
			res.render("pages/myProfile", {
				username: req.params.username,
				bio: query[0].bio,
				posts: userPosts,
				noOfPosts: req.query.noOfPosts,
			});
		} else {
			res.redirect(
				"/" +
					req.params.username +
					"/userProfile?context=" +
					req.params.username
			);
		}
	} else {
		res.redirect("/login");
	}
});

router
	.route("/:username/createPost")
	.get(async (req, res) => {
		if (userSession) {
			const authenticateUser = await userAuthModel
				.findOne({ username: req.params.username })
				.exec();
			if (req.session.id === authenticateUser.sessionID) {
				res.render("pages/createPost", {
					username: req.params.username,
				});
			} else {
				res.redirect(
					"/" +
						req.params.username +
						"/userProfile?context=" +
						req.params.username
				);
			}
		} else {
			res.redirect("/login");
		}
	})
	.post(async (req, res) => {
		if (userSession) {
			const query = await postDetailsModel.create({
				username: req.params.username,
				post: req.body.post,
			});
			await userDetailsModel.findOneAndUpdate(
				{
					username: req.params.username,
				},
				{
					$push: { posts: query._id },
				}
			);
			res.redirect("/" + req.params.username + "/myProfile?default=2");
		} else {
			res.redirect("/login");
		}
	});

router
	.route("/:username/editProfile")
	.get(async (req, res) => {
		if (userSession) {
			const authenticateUser = await userAuthModel
				.findOne({ username: req.params.username })
				.exec();
			if (req.sessionID === authenticateUser.sessionID) {
				res.render("pages/editProfile", { username: req.params.username });
			} else {
				res.redirect(
					"/" +
						req.params.username +
						"/userProfile?context=" +
						req.params.username
				);
			}
		} else {
			res.redirect("/login");
		}
	})
	.post(async (req, res) => {
		if (userSession) {
			console.log("Hello");
			const bio = req.body.bio;
			const query = await userDetailsModel
				.findOneAndUpdate({ username: req.params.username }, { bio: bio })
				.exec();
			console.log(query);
			res.redirect("/" + req.params.username + "/myProfile");
		} else {
			res.redirect("/login");
		}
	});

router.route("/:username/logout").get(async (req, res) => {
	if (userSession) {
		await userAuthModel.findOneAndUpdate(
			{ username: req.session.username },
			{ sessionID: "" }
		);
		req.session.destroy();
		userSession.destroy();
		res.redirect("/");
	} else {
		res.redirect("/:username/userProfile?context=" + req.params.username);
	}
});
