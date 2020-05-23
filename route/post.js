const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/requireLogin');
const postController = require('../controller/post');

router.post('/createpost',isLoggedIn , postController.addPost);

router.get('/allpost',isLoggedIn , postController.getAllPosts);

router.get('/post-followed-user',isLoggedIn , postController.getPostsOfFollowedUser);

router.delete('/delete-post/:postId',isLoggedIn , postController.deletePost);

router.get('/mypost',isLoggedIn , postController.getMyPosts);

router.put('/like',isLoggedIn , postController.likePost);

router.put('/unlike',isLoggedIn , postController.unLikePost);

router.post('/comment',isLoggedIn , postController.postComment);

router.delete('/delete-comment/:postId/:commentId',isLoggedIn , postController.deleteComment);

module.exports = router;