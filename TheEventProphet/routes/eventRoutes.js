const express = require('express');
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {isLoggedIn, isHost, isNotHost} = require('../middleware/auth');
const {validateId, validateEvent, validateResult, validateRSVP} = require('../middleware/validator');

const router = express.Router();

//GET /event
router.get('/', controller.allEvents);

//GET /event
router.get('/:id/show', validateId, controller.show);

//GET /newEvent
router.get('/new', isLoggedIn, controller.newEvent);

//POST /create newEvent
router.post('/', isLoggedIn, fileUpload, validateEvent, validateResult, controller.create);

//GET /edit
router.get('/:id/edit', isLoggedIn, validateId, isHost, controller.edit);

//PUT /update Edit
router.put('/:id/update', isLoggedIn, validateId, isHost, fileUpload, validateEvent, validateResult, controller.update);

//DELETE /delete event
router.delete('/:id', isLoggedIn, validateId, isHost, controller.delete);

//rsvp
router.put('/:id/rsvp', isLoggedIn, validateId, isNotHost, validateRSVP, validateResult, controller.handleRSVP);

module.exports = router;