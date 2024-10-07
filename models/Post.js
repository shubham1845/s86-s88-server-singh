const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User is required."],
  },
  commentText: {
    type: String,
    required: [true, "Comment text is required."],
  },
  comentOn: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    type: String,
    required: [true, "Name of author is required"],
  },
  userId: {
    type: String,
    // Assuming there's a User model
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  comments: [commentSchema], // Subdocument array for comments
});

module.exports = mongoose.model("Post", postSchema);
