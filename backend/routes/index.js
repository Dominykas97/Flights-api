const express = require('express');
const router = express.Router();
const db_utils = require('../db_utils/db_utils')

function secondsToTime(t) {
  return parseInt(t / 86400) + 'd ' + (new Date(t % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
}

router.get('/averageJourneyTime', async function (req, res, next) {

  const depair = req.query.depair.toUpperCase()
  const destair = req.query.destair.toUpperCase()

  const a = await db_utils.getAverageJourneyTime(depair, destair);
  console.log(a)

  res.json({ average: secondsToTime(a) });
});

router.get('/weekday', async function (req, res, next) {
  const depair = req.query.depair.toUpperCase()
  const a = await db_utils.getWeekdayPopularityByAirport(depair);
  console.log(a)
  res.json(a);

});

router.get('/fullcsv', async function (req, res, next) {
  db_utils.createTableAndPopulate("flighdata_B")
})

module.exports = router;


