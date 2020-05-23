const express = require('express');
const router = express.Router();
const otherProfileController = require('../controller/otherProfile');
const isLoggedIn = require('../middleware/requireLogin');


router.get('/user/:id',isLoggedIn, otherProfileController.getOtherProfile);

router.put('/follow',isLoggedIn,  otherProfileController.putFollow);

router.put('/unfollow', isLoggedIn, otherProfileController.putUnFollow);


module.exports = router;