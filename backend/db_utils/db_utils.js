const fs = require('fs');
const fastcsv = require('fast-csv');
const airportTimezone = require('airport-timezone');
const db = require('../db_utils/db')
const aviation = require('simple-aviation-api');

const tableNames = {
    FULL: "flighdata_B",
    SEGMENTS: "flighdata_B_segments"
}

const originalColumnsFull = {
    id: 0,
    depair: 1,
    destair: 2,
    indepartcode: 3,
    inarrivecode: 4,
    outflightno: 5,
    outdepartdate: 6,
    outdeparttime: 7,
    outarrivaldate: 8,
    outarrivaltime: 9,
    outbookingclass: 10,
    outflightclass: 11,
    outcarriercode: 12,
    inflightno: 13,
    indepartdate: 14,
    indeparttime: 15,
    inarrivaldate: 16,
    inarrivaltime: 17,
    inbookingclass: 18,
    inflightclass: 19,
    incarriercode: 20,
    originalprice: 21,
    originalcurrency: 22,
    reservation: 23,
    carrier: 24,
    oneway: 25
}

const modifiedColumnsFull = {
    id: 0,
    depair: 1,
    destair: 2,
    indepartcode: 3,
    inarrivecode: 4,
    outflightno: 5,
    outdepartdate: 6,
    outdeparttime: 7,
    outarrivaldate: 8,
    outarrivaltime: 9,
    outjourneytimeseconds: 10,
    outbookingclass: 11,
    outflightclass: 12,
    outcarriercode: 13,
    inflightno: 14,
    indepartdate: 15,
    indeparttime: 16,
    inarrivaldate: 17,
    inarrivaltime: 18,
    injourneytimeseconds: 19,
    inbookingclass: 20,
    inflightclass: 21,
    incarriercode: 22,
    originalprice: 23,
    originalcurrency: 24,
    reservation: 25,
    carrier: 26,
    oneway: 27
}


const originalColumnsSegments = {
    flightid: 0,
    depcode: 1,
    arrcode: 2,
    depdate: 3,
    arrdate: 4,
    deptime: 5,
    arrtime: 6,
    depterminal: 7,
    arrterminal: 8,
    flightno: 9,
    journey: 10,
    class: 11,
    bookingclass: 12
}

const modifiedColumnsSegments = {
    flightid: 0,
    depcode: 1,
    arrcode: 2,
    depdate: 3,
    arrdate: 4,
    deptime: 5,
    arrtime: 6,
    journeytimeseconds: 7,
    depterminal: 8,
    arrterminal: 9,
    flightno: 10,
    journey: 11,
    class: 12,
    bookingclass: 13
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


        return {weekdays:weekdays, count:sum}
    },

    getCountryPopularity: async function (country) {
        const airports = getAirportsByCountry(country)

        let airportInCountry = {}
        let airportsUsed = []
        if(airports.length>0){

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

    createTableAndPopulate: function (tableName) {
        const typesFlightsFullCsv =
            "`id` INT(7) NOT NULL, "
            + "`depair` VARCHAR(3) NOT NULL, "
            + "`destair` VARCHAR(3) NOT NULL, "
            + "`indepartcode` VARCHAR(3), "
            + "`inarrivecode` VARCHAR(3), "
            + "`outflightno` VARCHAR(10) NOT NULL, "
            + "`outdepartdate` DATE NOT NULL, "
            + "`outdeparttime` TIME NOT NULL, "
            + "`outarrivaldate` DATE NOT NULL, "
            + "`outarrivaltime` TIME NOT NULL, "
            + "`outjourneytimeseconds` INT(7), "
            + "`outbookingclass` VARCHAR(20), "
            + "`outflightclass` VARCHAR(30), "
            + "`outcarriercode` VARCHAR(2), "
            + "`inflightno` VARCHAR(10), "
            + "`indepartdate` DATE, "
            + "`indeparttime` TIME, "
            + "`inarrivaldate` DATE, "
            + "`inarrivaltime` TIME, "
            + "`injourneytimeseconds` INT(7), "
            + "`inbookingclass` VARCHAR(20), "
            + "`inflightclass` VARCHAR(30), "
            + "`incarriercode` VARCHAR(2), "
            + "`originalprice` FLOAT, "
            + "`originalcurrency` VARCHAR(5), "
            + "`reservation` VARCHAR(10), "
            + "`carrier` VARCHAR(30), "
            + "`oneway` BOOLEAN, "
            + "PRIMARY KEY (`id`)"

        const typesFlightsSegmentsCsv =
            "`flightid` INT(7) NOT NULL, "
            + "`depcode` VARCHAR(3) NOT NULL, "
            + "`arrcode` VARCHAR(3) NOT NULL, "
            + "`depdate` DATE, "
            + "`arrdate` DATE, "
            + "`deptime` TIME NOT NULL, "
            + "`arrtime` TIME NOT NULL, "
            + "`journeytimeseconds` INT(7), "
            + "`depterminal` VARCHAR(3), "
            + "`arrterminal` VARCHAR(3), "
            + "`flightno` VARCHAR(8) NOT NULL,"
            + "`journey` VARCHAR(3), "
            + "`class` VARCHAR(30), "
            + "`bookingclass` VARCHAR(30)"


        const columnsFlightsFullCsv =
            "id, depair, destair, indepartcode, inarrivecode, outflightno, outdepartdate, outdeparttime, "
            + "outarrivaldate, outarrivaltime, outjourneytimeseconds, outbookingclass, outflightclass, outcarriercode, inflightno, "
            + "indepartdate, indeparttime, inarrivaldate, inarrivaltime, injourneytimeseconds, inbookingclass, inflightclass, "
            + "incarriercode, originalprice, originalcurrency, reservation, carrier, oneway";

        const columnsFlightsSegmentsCsv =
            "flightid, depcode, arrcode, depdate, arrdate, deptime, arrtime, journeytimeseconds, "
            + "depterminal, arrterminal, flightno, journey, class, bookingclass"

        // readCsvPopulateDB("../flighdata_B/flighdata_B.csv", tableNames.FULL, typesFlightsFullCsv, columnsFlightsFullCsv);
        readCsvPopulateDB("../flighdata_B/flighdata_B_segments.csv", tableNames.SEGMENTS, typesFlightsSegmentsCsv, columnsFlightsSegmentsCsv);
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
                    const outTimeDiff = airportOffSetDifferenceHours(row[originalColumnsFull.depair], row[originalColumnsFull.destair]);

                    let outJourneyTimeSecondsTimezoneAdjusted = calculateJourneyTime(row[originalColumnsFull.outarrivaldate], row[originalColumnsFull.outarrivaltime]
                        , row[originalColumnsFull.outdepartdate], row[originalColumnsFull.outdeparttime], outTimeDiff)
                    row.splice(modifiedColumnsFull.outjourneytimeseconds, 0, outJourneyTimeSecondsTimezoneAdjusted)

                    if (row[originalColumnsFull.oneway + 1] === '0') {
                        const inTimeDiff = airportOffSetDifferenceHours(row[modifiedColumnsFull.indepartcode], row[originalColumnsFull.inarrivecode]);
                        let inJourneyTimeSecondsTimezoneAdjusted = calculateJourneyTime(row[modifiedColumnsFull.inarrivaldate], row[modifiedColumnsFull.inarrivaltime]
                            , row[modifiedColumnsFull.indepartdate], row[modifiedColumnsFull.indeparttime], inTimeDiff)

                        row.splice(modifiedColumnsFull.injourneytimeseconds, 0, inJourneyTimeSecondsTimezoneAdjusted)
                    }
                    else {
                        row.splice(modifiedColumnsFull.injourneytimeseconds, 0, null)

                    }
                }
            }
            if (tableName === tableNames.SEGMENTS) {
                for (rowIndex = 0; rowIndex < csvData.length; rowIndex++) {
                    const row = csvData[rowIndex];
                    const timeDiff = airportOffSetDifferenceHours(row[originalColumnsSegments.depcode], row[originalColumnsSegments.arrcode]);

                    const arrDate = row[originalColumnsSegments.arrdate];
                    const arrTime = row[originalColumnsSegments.arrtime];
                    const depDate = row[originalColumnsSegments.depdate];
                    const depTime = row[originalColumnsSegments.deptime];

                    let journeyTimeSecondsTimezoneAdjusted = null
                    if (arrDate === null | arrTime === null | depDate === null | depTime === null) {
                        row.splice(modifiedColumnsSegments.journeytimeseconds, 0, null)
                    }
                    else {
                        journeyTimeSecondsTimezoneAdjusted = calculateJourneyTime(arrDate, arrTime, depDate, depTime, timeDiff)
                        row.splice(modifiedColumnsSegments.journeytimeseconds, 0, journeyTimeSecondsTimezoneAdjusted)
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