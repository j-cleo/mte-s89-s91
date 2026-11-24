const express = require("express");
const blogController = require("../controllers/blog");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/addPost", verify, blogController.addPost);
router.get("/getPosts", verify, blogController.getPosts);
router.get("/:id", verify, blogController.getPost);
router.patch("/:id", verify, blogController.updatePost);
router.delete("/:id", verify, blogController.deletePost);
router.post("/:id/addComment", verify, blogController.addComment);
router.get("/:id/getComments", verify, blogController.getComments);

module.exports = router;