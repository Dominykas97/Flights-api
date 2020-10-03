const fs = require('fs');
const fastcsv = require('fast-csv');
const airportTimezone = require('airport-timezone');
const db = require('../db_utils/db')

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
    journeytimeseconds: 10,
    outbookingclass: 11,
    outflightclass: 12,
    outcarriercode: 13,
    inflightno: 14,
    indepartdate: 15,
    indeparttime: 16,
    inarrivaldate: 17,
    inarrivaltime: 18,
    inbookingclass: 19,
    inflightclass: 20,
    incarriercode: 21,
    originalprice: 22,
    originalcurrency: 23,
    reservation: 24,
    carrier: 25,
    oneway: 26
}

function airportCodeToTimeOffset(airportCode) {
    return airportTimezone.filter(function (airport) {
        return airport.code === airportCode;
    })[0].offset.gmt
}

function airportOffSetDifferenceHours(airport1, airport2) {
    return airportCodeToTimeOffset(airport1) - airportCodeToTimeOffset(airport2)
}

function secondsToTime(t) {
    return parseInt(t / 86400) + 'd ' + (new Date(t % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
}


module.exports = {

    getAverageJourneyTime: async function (depair, destair) {
        let tableName = "flighdata_B"
        const [rows, fields] = await db.query("SELECT AVG(`journeytimeseconds`) FROM " + tableName + " WHERE `depair`= ? AND`destair`= ?", [depair, destair]);
        return rows[0]['AVG(`journeytimeseconds`)']
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
            + "`journeytimeseconds` INT(7), "
            + "`outbookingclass` VARCHAR(20), "
            + "`outflightclass` VARCHAR(30), "
            + "`outcarriercode` VARCHAR(2), "
            + "`inflightno` VARCHAR(10), "
            + "`indepartdate` DATE, "
            + "`indeparttime` TIME, "
            + "`inarrivaldate` DATE, "
            + "`inarrivaltime` TIME, "
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
            + "`depterminal` VARCHAR(3), "
            + "`arrterminal` VARCHAR(3), "
            + "`flightno` VARCHAR(8) NOT NULL,"
            + "`journey` VARCHAR(3), "
            + "`class` VARCHAR(30), "
            + "`bookingclass` VARCHAR(30)"


        const columnsFlightsFullCsv =
            "id, depair, destair, indepartcode, inarrivecode, outflightno, outdepartdate, outdeparttime, "
            + "outarrivaldate, outarrivaltime, journeytimeseconds, outbookingclass, outflightclass, outcarriercode, inflightno, "
            + "indepartdate, indeparttime, inarrivaldate, inarrivaltime, inbookingclass, inflightclass, "
            + "incarriercode, originalprice, originalcurrency, reservation, carrier, oneway";

        const columnsFlightsSegmentsCsv =
            "flightid, depcode, arrcode, depdate, arrdate, deptime, arrtime, "
            + "depterminal, arrterminal, flightno, journey, class, bookingclass"

        readCsvPopulateDB("../flighdata_B/flighdata_B.csv", "flighdata_B", typesFlightsFullCsv, columnsFlightsFullCsv);
        // readCsvPopulateDB("../flighdata_B/flighdata_B_segments.csv", "flighdata_B_segments", typesFlightsSegmentsCsv, columnsFlightsSegmentsCsv);

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
            for (rowIndex = 0; rowIndex < csvData.length; rowIndex++) {
                const row = csvData[rowIndex];
                const timeDiff = airportOffSetDifferenceHours(row[originalColumnsFull.depair], row[originalColumnsFull.destair]);

                let journeyTimeSecondsTimezoneAdjusted = (new Date(row[originalColumnsFull.outarrivaldate] + ' ' + row[originalColumnsFull.outarrivaltime])
                    - new Date(row[originalColumnsFull.outdepartdate] + ' ' + row[originalColumnsFull.outdeparttime])) / 1000 + 3600 * timeDiff

                row.splice(modifiedColumnsFull.journeytimeseconds, 0, journeyTimeSecondsTimezoneAdjusted)
            }
            populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights);
        });
    stream.pipe(csvStream);
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