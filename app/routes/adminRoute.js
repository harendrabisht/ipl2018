const express = require('express');
const router = express.Router();
const teamCtrl = require('../controllers/teamController');
const playerCtrl = require('../controllers/playerController');
const seriesCtrl = require('../controllers/seriesController');
const matchCtrl = require('../controllers/matchController');
const bettingTypeCtrl = require('../controllers/bettingTypeController');
const bettingPointsCtrl = require('../controllers/bettingPointsController');

/**
 * Team Routes
 */
router
    .route('/team')
    .post(teamCtrl.create)
    .get(teamCtrl.getList);
router
    .route('/team/:teamId')
    .get(teamCtrl.getListById)
    .put(teamCtrl.updateListById)
    .delete(teamCtrl.deleteById);

router
    .route('/team-by-format')
    .get(teamCtrl.teamByFormat);
    
router.param('teamId', teamCtrl.teamById);
/**
 * Player Routes
 */
router
    .route('/player')
    .post(playerCtrl.create)
    .get(playerCtrl.getList);
router
    .route('/player/:playerId')
    .get(playerCtrl.getListById)
    .put(playerCtrl.updateListById)
    .delete(playerCtrl.deleteById);
    
router.param('playerId', playerCtrl.playerById);

/**
 * Series Routes
 */
router
    .route('/series')
    .post(seriesCtrl.create)
    .get(seriesCtrl.getList);
router
    .route('/series/:seriesId')
    .get(seriesCtrl.getListById)
    .put(seriesCtrl.updateListById)
    .delete(seriesCtrl.deleteById);
router.param('seriesId', seriesCtrl.SeriesById);
/**
 * Match Routes
 */
router
    .route('/match')
    .post(matchCtrl.create)
    .get(matchCtrl.getList);
router
    .route('/match/:matchId')
    .get(matchCtrl.getListById)
    .put(matchCtrl.updateListById)
    .delete(matchCtrl.deleteById);
router.param('matchId', matchCtrl.MatchById);

router
    .route('/matches-by-format')
    .get( matchCtrl.getMatchesByFormats);

/**
 * Betting Type Routes
 */
router
    .route('/betting-type')
    .post(bettingTypeCtrl.create)
    .get(bettingTypeCtrl.getList);
router
    .route('/betting-type/:typeId')
    .get(bettingTypeCtrl.getListById)
    .put(bettingTypeCtrl.updateListById)
    .delete(bettingTypeCtrl.deleteById);
router.param('typeId', bettingTypeCtrl.BettingTypeById);
/**
 * Betting Points Routes
 */
router
    .route('/betting-point')
    .post(bettingPointsCtrl.create)
    .get(bettingPointsCtrl.getList);
router
    .route('/betting-point/:pointId')
    .get(bettingPointsCtrl.getListById)
    .put(bettingPointsCtrl.updateListById)
    .delete(bettingPointsCtrl.deleteById);

// router.param('pointId', bettingPointsCtrl.BettingPointsById);

router
    .route('/betting-point/:match_id/team')
    .post(bettingPointsCtrl.saveTeamPoints)
    .get(bettingPointsCtrl.getTeamPoints);

router.param('match_id', bettingPointsCtrl.PointsByMatchId);

router
    .route('/betting-point/:matchid/player')
    .post(bettingPointsCtrl.playerPoints)
    .get(bettingPointsCtrl.getPlayerPoints);

router
    .route('/betting-point/:pointId')
    .get(bettingPointsCtrl.getListById)
    .put(bettingPointsCtrl.updateListById)
    .delete(bettingPointsCtrl.deleteById);
router.param('matchid', bettingPointsCtrl.pointsByMatch);

router
    .route('/bettings')
    .get(bettingPointsCtrl.getBettings);
router
    .route('/match-betting/:matchid')
    .get(bettingPointsCtrl.getBettingByMatch);

router
    .route('/match-betting/create')
    .post(bettingPointsCtrl.saveBettingByMatch);

router
    .route('/match-result/:matchid')
    .get(bettingPointsCtrl.getBettingResult);
router
    .route('/publish-match-result/:matchid')
    .get(bettingPointsCtrl.publishMatchResult);

module.exports = router;