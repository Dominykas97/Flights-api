const express = require('express');
const router = express.Router();
const db_utils = require('../db_utils/db_utils')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const a = await db_utils.getAverageJourneyTime("LHR", "DXB");
  console.log(a)
  // res.render('index', { title: "Express" });
  res.json({average:a});
});

router.get('/fullcsv', async function (req, res, next) {
  db_utils.createTableAndPopulate("flighdata_B")
})

module.exports = router;


