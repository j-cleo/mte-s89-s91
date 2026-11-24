const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Blog title is Required"]
	},
	content: {
		type: String,
		required: [true, "Blog content is Required"]
	},
	author: {
		type: String,
		required: [true, "Blog author is Required"]
	},
	date: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			user: {
				type: String,
				required: [true, "Commenter information is Required"]
			},
			comment: {
				type: String,
				required: [true, "Comment content is Required"]
			}
		}
	]
});

module.exports = mongoose.model('Blog', blogSchema);