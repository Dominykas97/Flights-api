const mysql = require('mysql');
const fs = require('fs');
const fastcsv = require('fast-csv');

const dbConfig = {
    host: "sql2.freemysqlhosting.net",
    database: "sql2368079",
    user: "sql2368079",
    password: "hK3*hZ6!",
    port: 3306
};

const con = mysql.createConnection(dbConfig);

module.exports = {
    createTableAndPopulate: function (tableName) {

        // create a new connection to the database
        // const con = mysql.createConnection(dbConfig);

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
            + "outarrivaldate, outarrivaltime, outbookingclass, outflightclass, outcarriercode, inflightno, "
            + "indepartdate, indeparttime, inarrivaldate, inarrivaltime, inbookingclass, inflightclass, "
            + "incarriercode, originalprice, originalcurrency, reservation, carrier, oneway";

        const columnsFlightsSegmentsCsv =
            "flightid, depcode, arrcode, depdate, arrdate, deptime, arrtime, "
            + "depterminal, arrterminal, flightno, journey, class, bookingclass"

        readCsvPopulateDB("../flighdata_B/flighdata_B.csv", "flighdata_B", typesFlightsFullCsv, columnsFlightsFullCsv);
        readCsvPopulateDB("../flighdata_B/flighdata_B_segments.csv", "flighdata_B_segments", typesFlightsSegmentsCsv, columnsFlightsSegmentsCsv);
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

            populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights);
        });
    stream.pipe(csvStream);
}

function populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights) {

    // open the connection
    // con.connect(error => {
    //     if (error) {
    //         console.error(error);
    //     }
    //     else {
    con.query("CREATE TABLE IF NOT EXISTS " + tableName + " (" + sqlTypesFlights + ") ENGINE = InnoDB;",
        function (err, result) {
            if (err)
                throw err;
            console.log("TABLE created");
        });

    // con.query("SET SQL_MODE='ALLOW_INVALID_DATES'", (error, response) => {
    //   console.log(error || response);
    // });

    con.query("TRUNCATE TABLE " + tableName, (error, response) => {
        console.log(error, response);
    });

    con.query("INSERT INTO " + tableName + " (" + sqlColumnsFlights + ") VALUES ?", [csvData], (error, response) => {
        console.log(error || response);
    });
    con.query("SHOW WARNINGS", (error, response) => {
        console.log(error, response);
    });
    // }
    // });
}