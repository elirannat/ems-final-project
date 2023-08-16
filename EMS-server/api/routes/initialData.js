const express = require('express');
const router = express.Router();
const CONSTANTS = require('../config/constants');
const InitialDataController = require('../controllers/initialData');

router.post('/store_data', InitialDataController.storeData);

module.exports = router;
