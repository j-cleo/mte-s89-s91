const Blog = require("../models/Blog.js");
const { errorHandler } = require('../auth.js');

module.exports.addPost = (req, res) => {
	const { title, content } = req.body;
	const { username } = req.user;

	let newPost = new Blog({
		title: title,
		content: content,
		author: username
	})

	return newPost.save()
	.then(result => res.status(201).send({
		result
	}))
	.catch(err => errorHandler(err, req, res));
}

module.exports.getPosts = (req, res) => {
	return Blog.find({})
	.then(blog => {
		if(!blog) {
			return res.status(404).send({ error: "Blogs not found!" });
		}

		return res.status(200).send(blog);
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.getPost = (req, res) => {
	return Blog.findById( req.params.id )
	.then(blog => {
		if(!blog) {
			return res.status(404).send({ error: "Blog not found!" });
		}

		return res.status(200).send(blog);
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.updatePost = (req, res) => {
	const { username } = req.user;

	let postUpdate = {
		title: req.body.title,
		content: req.body.content
	}

	return Blog.findByIdAndUpdate(req.params.id, postUpdate)
	.then(blog => {
		if(!blog) {
			return res.status(404).send({ error: "Blog not found!"});
		} else if (username !== blog.author) {
			return res.status(403).send({ error: "User must be the author of the post!"});
		}

		return res.status(200).send({ message: "Blog updated successfully!"});
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.deletePost = (req, res) => {
	return Blog.findByIdAndDelete( req.params.id )
	.then(blog => {
		if(!blog) {
			return res.status(404).send({ error: "Blog not found!" });
		} else if ((req.user.username !== blog.author) && !req.user.isAdmin) {
			return res.status(403).send({ error: "User must be the author of the post!" });
		}

		return res.status(200).send({ message: "Blog deleted successfully!" });
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.addComment = (req, res) => {
	const { username } = req.user;
	const { comment } = req.body;

	return Blog.findById(req.params.id)
	.then(blog => {

		if(!blog) {
			return res.status(404).send({ error: "Blog not found!" });
		}

		blog.comments.push({
			user: username,
			comment: comment
		})

		return blog.save()
		.then(blog => {
			res.status(201).send({
				message: "Added comment successfully!"
			});
		});
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.getComments = (req, res) => {
	return Blog.findById(req.params.id)
	.then(blog => {
		if(!blog.comments) {
			return res.status(400).send({ error: "Error fetching comments!"});
		}

		return res.status(200).send({ comments: blog.comments });
	})
}