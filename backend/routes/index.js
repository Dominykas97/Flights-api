const express = require('express');
const router = express.Router();
const db_utils = require('../db_utils/db_utils')

function secondsToTime(t) {
  return parseInt(t / 86400) + 'd ' + (new Date(t % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
}

router.get('/averageJourneyTime', async function (req, res, next) {

  const depair = req.query.depair.toUpperCase()
  const destair = req.query.destair.toUpperCase()

  const journeys = await db_utils.getJourneyTimes(depair, destair);
  console.log(journeys)
  if (journeys.length > 0) {
    const averageJourneyTime = journeys.reduce((prev, curr) => prev + curr) / journeys.length;
    res.json({ average: secondsToTime(averageJourneyTime), data: journeys });
  }
  else {
    res.status(400).json({ average: "This journey does not exist." })
  }
});

router.get('/weekday', async function (req, res, next) {
  const depair = req.query.depair.toUpperCase()
  const weekdaysByAirport = await db_utils.getWeekdayPopularityByAirport(depair);
  console.log(weekdaysByAirport)
  res.json(weekdaysByAirport);

});

router.get('/businessDays', async function (req, res, next) {
  // const depair = req.query.depair.toUpperCase()
  const weekdaysByAirport = await db_utils.getBusinessDays();
  console.log(weekdaysByAirport)
  res.json(weekdaysByAirport);

});

router.get('/fullcsv', async function (req, res, next) {
  db_utils.createTableAndPopulate("flighdata_B")
})

module.exports = router;


