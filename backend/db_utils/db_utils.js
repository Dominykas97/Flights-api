const fs = require('fs');
const fastcsv = require('fast-csv');
const airportTimezone = require('airport-timezone');
const db = require('../db_utils/db')
const aviation = require('simple-aviation-api');
const constants2 = require('./constants')

const tableNames = {
    FULL: "flighdata_B",
    SEGMENTS: "flighdata_B_segments"
}

var weekday = new Array(7);
weekday[0] = "Monday";
weekday[1] = "Tuesday";
weekday[2] = "Wednesday";
weekday[3] = "Thursday";
weekday[4] = "Friday";
weekday[5] = "Saturday";
weekday[6] = "Sunday";

function airportCodeToTimeOffset(airportCode) {
    return airportTimezone.filter(function (airport) {
        return airport.code === airportCode;
    })[0].offset.gmt
}

function airportOffSetDifferenceHours(departureAirport, arrivalAirport) {
    return airportCodeToTimeOffset(departureAirport) - airportCodeToTimeOffset(arrivalAirport)
}


function getAirportsByCountry(country) {

    const x = aviation.getAllAirportsBy('country', country);//country.charAt(0).toUpperCase() + country.slice(1).toLowerCase());
    const airports = []
    console.log(x)

    x.forEach(function (row) {
        if (row['iata'] !== '')
            airports.push(row['iata'])
    })
    console.log(airports)
    return airports
}

module.exports = {

    getJourneyTimes: async function (depair, destair) {
        let journeyTimes = []

        // SELECT `outjourneytimeseconds` FROM `flighdata_B` WHERE `depair`="LHR" and `destair`="DXB"
        const [rows, fields] = await db.query("SELECT `outjourneytimeseconds` FROM " + tableNames.FULL
            + " WHERE `depair`= ? AND`destair`= ?", [depair, destair]);
        rows.forEach(function (row) {
            journeyTimes.push(row['outjourneytimeseconds'])
        })

        const [rows2, fields2] = await db.query("SELECT `injourneytimeseconds` FROM " + tableNames.FULL
            + " WHERE `indepartcode`= ? AND`inarrivecode`= ?", [depair, destair]);
        rows2.forEach(function (row) {
            journeyTimes.push(row['injourneytimeseconds'])
        })

        const [rows3, fields3] = await db.query("SELECT `journeytimeseconds` FROM " + tableNames.SEGMENTS
            + " WHERE `deptime`!=\"00:00:00\" AND `arrtime`!=\"00:00:00\" AND `depcode`= ? AND`arrcode`= ?", [depair, destair]);
        rows3.forEach(function (row) {
            journeyTimes.push(row['journeytimeseconds'])
        })
        return journeyTimes
    },

    getBusinessDays: async function () {
        let days = {}
        // SELECT `outjourneytimeseconds` FROM `flighdata_B` WHERE `depair`="LHR" and `destair`="DXB"
        const [rows, fields] = await db.query("SELECT `outflightclass`, COUNT(*) as count FROM " + tableNames.FULL + " GROUP BY `outflightclass`");
        // console.log(rows)
        rows.forEach(function (row) {
            days[row['outflightclass']] = row['count']
        })


        const [rows2, fields2] = await db.query("SELECT `inflightclass`, COUNT(*) as count FROM " + tableNames.FULL + " WHERE `oneway`=\"0\" GROUP BY `inflightclass`");
        // console.log(rows2)
        rows2.forEach(function (row) {
            days[row['inflightclass']] += row['count']
        })

        const [rows3, fields3] = await db.query("SELECT `class`, COUNT(*) as count FROM " + tableNames.SEGMENTS + " GROUP BY `class`");
        // console.log(rows3)
        rows3.forEach(function (row) {
            days[row['class']] += row['count']
        })

        let sum = Object.values(days).reduce((a, b) => a + b, 0)

        return { days: days, count: sum }
    },

    getWeekdayPopularityByAirport: async function (depair) {
        let weekdays = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0
        }
        // SELECT WEEKDAY(`outdepartdate`) as weekday, COUNT(*) FROM `flighdata_B` WHERE `depair`="MAN" GROUP BY weekday 
        const [rows, fields] = await db.query("SELECT WEEKDAY(`outdepartdate`) as weekday, COUNT(*) as count FROM " + tableNames.FULL
            + " WHERE `depair`=? GROUP BY weekday ", [depair]);
        rows.forEach(function (row) {
            weekdays[weekday[row.weekday]] += row.count
        })

        const [rows2, fields2] = await db.query("SELECT WEEKDAY(`indepartdate`) as weekday, COUNT(*) as count FROM " + tableNames.FULL
            + " WHERE `oneway`=\"0\" AND `depair`=? GROUP BY weekday ", [depair]);
        rows2.forEach(function (row) {
            weekdays[weekday[row.weekday]] += row.count
        })

        const [rows3, fields3] = await db.query("SELECT WEEKDAY(`depdate`) as weekday, COUNT(*) as count FROM " + tableNames.SEGMENTS
            + " WHERE `depdate`!=NULL AND `depcode`=? GROUP BY weekday ", [depair]);
        rows3.forEach(function (row) {
            weekdays[weekday[row.weekday]] += row.count
        })

        let sum = Object.values(weekdays).reduce((a, b) => a + b, 0)


        return { weekdays: weekdays, count: sum }
    },

    getCountryPopularity: async function (country) {
        const airports = getAirportsByCountry(country)

        let airportInCountry = {}
        let airportsUsed = []
        if (airports.length > 0) {

            // SELECT WEEKDAY(`outdepartdate`) as weekday, COUNT(*) FROM `flighdata_B` WHERE `depair`="MAN" GROUP BY weekday 
            const [rows, fields] = await db.query("SELECT `depair`, COUNT(*) as count FROM " + tableNames.FULL
                + " WHERE `depair` IN (?) GROUP BY `depair`", [airports]);
            console.log(rows)
            rows.forEach(function (row) {
                airportsUsed.push(row.depair)
                airportInCountry[row.depair] = row.count
            })
        }

        // const [rows2, fields2] = await db.query("SELECT WEEKDAY(`indepartdate`) as weekday, COUNT(*) as count FROM " + tableNames.FULL
        //     + " WHERE `oneway`=\"0\" AND `depair`=? GROUP BY weekday ", [depair]);
        // rows2.forEach(function (row) {
        //     weekdays[weekday[row.weekday]] += row.count
        // })

        // const [rows3, fields3] = await db.query("SELECT WEEKDAY(`depdate`) as weekday, COUNT(*) as count FROM " + tableNames.SEGMENTS
        //     + " WHERE `depdate`!=NULL AND `depcode`=? GROUP BY weekday ", [depair]);
        // rows3.forEach(function (row) {
        //     weekdays[weekday[row.weekday]] += row.count
        // })
        let sum = Object.values(airportInCountry).reduce((a, b) => a + b, 0)


        return { airports: airportsUsed, count: sum, data: airportInCountry }
    },

    createTableAndPopulate: function () {

        readCsvPopulateDB("../flighdata_B/flighdata_B.csv", tableNames.FULL, constants2.typesFlightsFullCsv, constants2.columnsFlightsFullCsv);
        readCsvPopulateDB("../flighdata_B/flighdata_B_segments.csv", tableNames.SEGMENTS, constants2.typesFlightsSegmentsCsv, constants2.columnsFlightsSegmentsCsv);
    }
};

function readCsvPopulateDB(csv, tableName, sqlTypesFlights, sqlColumnsFlights) {
    let stream = fs.createReadStream(csv);
    let csvData = [];
    let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
            data.forEach(function (item, i) {
                if (item == '') {
                    data[i] = null;
                }
            });
            csvData.push(data);
        })
        .on("end", function () {
            // remove the first line: header
            csvData.shift();
            if (tableName === tableNames.FULL) {
                for (rowIndex = 0; rowIndex < csvData.length; rowIndex++) {
                    const row = csvData[rowIndex];
                    const outTimeDiff = airportOffSetDifferenceHours(row[constants2.originalColumnsFull.depair], row[constants2.originalColumnsFull.destair]);

                    let outJourneyTimeSecondsTimezoneAdjusted = calculateJourneyTime(row[constants2.originalColumnsFull.outarrivaldate], row[constants2.originalColumnsFull.outarrivaltime]
                        , row[constants2.originalColumnsFull.outdepartdate], row[constants2.originalColumnsFull.outdeparttime], outTimeDiff)
                    row.splice(constants2.modifiedColumnsFull.outjourneytimeseconds, 0, outJourneyTimeSecondsTimezoneAdjusted)

                    if (row[constants2.originalColumnsFull.oneway + 1] === '0') {
                        const inTimeDiff = airportOffSetDifferenceHours(row[constants2.modifiedColumnsFull.indepartcode], row[constants2.originalColumnsFull.inarrivecode]);
                        let inJourneyTimeSecondsTimezoneAdjusted = calculateJourneyTime(row[constants2.modifiedColumnsFull.inarrivaldate], row[constants2.modifiedColumnsFull.inarrivaltime]
                            , row[constants2.modifiedColumnsFull.indepartdate], row[constants2.modifiedColumnsFull.indeparttime], inTimeDiff)

                        row.splice(constants2.modifiedColumnsFull.injourneytimeseconds, 0, inJourneyTimeSecondsTimezoneAdjusted)
                    }
                    else {
                        row.splice(constants2.modifiedColumnsFull.injourneytimeseconds, 0, null)

                    }
                }
            }
            if (tableName === tableNames.SEGMENTS) {
                for (rowIndex = 0; rowIndex < csvData.length; rowIndex++) {
                    const row = csvData[rowIndex];
                    const timeDiff = airportOffSetDifferenceHours(row[constants2.originalColumnsSegments.depcode], row[constants2.originalColumnsSegments.arrcode]);

                    const arrDate = row[constants2.originalColumnsSegments.arrdate];
                    const arrTime = row[constants2.originalColumnsSegments.arrtime];
                    const depDate = row[constants2.originalColumnsSegments.depdate];
                    const depTime = row[constants2.originalColumnsSegments.deptime];

                    let journeyTimeSecondsTimezoneAdjusted = null
                    if (arrDate === null | arrTime === null | depDate === null | depTime === null) {
                        row.splice(constants2.modifiedColumnsSegments.journeytimeseconds, 0, null)
                    }
                    else {
                        journeyTimeSecondsTimezoneAdjusted = calculateJourneyTime(arrDate, arrTime, depDate, depTime, timeDiff)
                        row.splice(constants2.modifiedColumnsSegments.journeytimeseconds, 0, journeyTimeSecondsTimezoneAdjusted)
                    }
                }
            }
            populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights);
        });
    stream.pipe(csvStream);

    function calculateJourneyTime(arrivalDate, arrivalTime, departureDate, departureTime, airportsTimezoneDifference) {
        return (new Date(arrivalDate + ' ' + arrivalTime) - new Date(departureDate + ' ' + departureTime)) / 1000 + 3600 * airportsTimezoneDifference;
    }
}

async function populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights) {

    let [error, response] = await db.query("CREATE TABLE IF NOT EXISTS " + tableName + " (" + sqlTypesFlights + ") ENGINE = InnoDB;");
    console.log(error || response)

    // con.query("SET SQL_MODE='ALLOW_INVALID_DATES'", (error, response) => {
    //   console.log(error || response);
    // });

    let [error2, response2] = await db.query("TRUNCATE TABLE " + tableName)
    console.log(error2 || response2)

    let [error3, response3] = await db.query("INSERT INTO " + tableName + " (" + sqlColumnsFlights + ") VALUES ?", [csvData])
    console.log(error3 || response3)

    let [error4, response4] = await db.query("SHOW WARNINGS")
    console.log(error4 || response4)

}