const express = require("express");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const postController = require("../controllers/post");

const router = express.Router();
router.post("/addPost", verify, postController.addPost);
router.get("/post/:id", postController.getPostUsingId);

router.get("/all-posts", postController.getPosts);
router.patch("/update/:id", verify, postController.updatePost);
router.delete("/delete/:id", verify, postController.deletePost);
router.patch("/post/comments/:id", verify, postController.addComment);
router.get("/post/comments/:id", verify, postController.getComments);

module.exports = router;
