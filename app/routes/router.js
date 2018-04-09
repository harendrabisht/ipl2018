const express = require('express');
const adminRoute = require('./adminRoute');
const userRoute = require('./userRoutes');
const dashboardRoute = require('./dashboardRoute');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/v1', adminRoute);
router.use('/v1/user', userRoute);
router.use('/v1/dashboard', dashboardRoute);

module.exports = router;
