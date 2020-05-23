const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const isLoggedIn = require('../middleware/requireLogin');

router.get('/', isLoggedIn, (req, res) => {
    res.send('hello from auth');
})

router.post('/signup', authController.postSignup);

router.post('/signin', authController.postLogin);

router.put('/upload-pic', isLoggedIn, authController.putUploadPic);

router.post('/reset-password', authController.postReset);

router.post('/new-password', authController.postNewPassword);

router.post('/search-user',isLoggedIn , authController.getSearchedUsers);

module.exports = router;