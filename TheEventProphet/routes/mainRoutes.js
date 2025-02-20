const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

//GET /index
router.get('/', controller.index);

//GET /event/aboutus/ 
router.get('/aboutus', controller.aboutus);

//GET /event/contactus/ 
router.get('/contactus', controller.contactus);

module.exports = router;