const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');

router
    .route('/trending')
    .get( userController.getTrendingBet);
module.exports = router;