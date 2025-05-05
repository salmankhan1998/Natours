const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authControllers = require('./../controllers/authControllers');

const router = express.Router();

// router.param('id', tourControllers.checkId);

router
  .route('/top-5-cheap')
  .get(tourControllers.allTopTourAlias, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getAllTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlanTours);

router
  .route('/')
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

module.exports = router;
