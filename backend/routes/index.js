const express = require('express');
const router = express.Router();
const db_utils = require('../db_utils/db')

/* GET home page. */
router.get('/', function (req, res, next) {

  db_utils.createTableAndPopulate(`flighdata_B`);

  res.render('index', { title: 'Express' });
});

module.exports = router;


