const Post = require("../models/Post");

module.exports.addPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user from the authentication middleware

    const newPost = new Post({
      title,
      content,
      author,
      userId, // Save the user's ID with the post
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
      //   userId: userId, // Return the user's ID in the response
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

// get specific post using id
module.exports.getPostUsingId = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the URL parameter
    const post = await Post.findById(postId); // Find the post by its ID

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving post",
      error: error.message,
    });
  }
};

// Get all Posts for all users
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // find all post
    res.status(200).json({
      message: "Posts retrived successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
    });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post to check ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    // Update the post if the user is the owner
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    // Find the post to check ownership
    const post = await Post.findById(postId);
    // If post not found, return 404
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post or an admin
    const isAuthorized = post.userId === req.user.id || req.user.isAdmin;
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }
    await Post.findByIdAndDelete(postId); // Delete the post
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
};

// add comment on post
module.exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { commentText } = req.body;
    //Assuming 'req.user' contain the authenticated user's username
    const userName = req.user.username;
    //find the post id
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Add the comment
    const newComment = {
      user: userName, // Save the user's email instead of `user.name`
      commentText,
    };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json({
      message: "Comment added successfully!",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    // find the post by id and populate comments
    const post = await Post.findById(postId).select("comments");
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.status(200).json({
      message: "Comments retrieved successfully!",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving comments",
      error: error.message,
    });
  }
};
