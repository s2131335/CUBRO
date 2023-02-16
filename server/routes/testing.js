const express = require('express');
const router = express.Router();
const {generateTutor} = require('../controllers/testing');

router.get('/gen-tutor/:no',generateTutor);

module.exports = router;

