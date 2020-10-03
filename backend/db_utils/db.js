const mysql = require('mysql2/promise');

const dbConfig = {
    connectionLimit: 10,
    host: "sql2.freemysqlhosting.net",
    database: "sql2368079",
    user: "sql2368079",
    password: "hK3*hZ6!",
    port: 3306
};

const con = mysql.createPool(dbConfig);

module.exports = con


// const util = require('util');
// const mysql = require( 'mysql' );

// function makeDb(config) {
//     const connection = mysql.createConnection(config); return {
//         query(sql, args) {
//             return util.promisify(connection.query)
//                 .call(connection, sql, args);
//         },
//         close() {
//             return util.promisify(connection.end).call(connection);
//         }
//     };
// }


// async function withTransaction(db, callback) {
//     try {
//         await db.beginTransaction();
//         await callback();
//         await db.commit();
//     } catch (err) {
//         await db.rollback();
//         throw err;
//     } finally {
//         await db.close();
//     }
// }

// var sqlConnection = async function sqlConnection(sql, values, next) {

//     // It means that the values hasnt been passed
//     if (arguments.length === 2) {
//         next = values;
//         values = null;
//     }

//     var connection = mysql.createConnection(dbConfig);
//     connection.connect(function(err) {
//         if (err !== null) {
//             console.log("[MYSQL] Error connecting to mysql:" + err+'\n');
//         }
//     });
//     async function  getAverageJourneyTime(db) {
//                 const average = await connection.execute("SELECT AVG(`journeytimeseconds`) FROM " + tableName + " WHERE `depair`=\"LHR\" AND`destair`=\"DXB\"")
//                 // , (error, response) => {
//                 //     // console.log(error, s2t(response[0]['AVG(`journeytimeseconds`)']));
//                 //     // return s2t(response[0]['AVG(`journeytimeseconds`)'])
//                 // }
//                 // );
//                 // try {
//                 //     await withTransaction(db, async () => {
//                 //         const someRows = await db.query('SELECT * FROM flighdata_B');
//                 //         // const otherRows = await db.query( 'SELECT * FROM other_table' );
//                 //         // do something with someRows and otherRows

//                 //         // console.log(someRows)
//                 //         return someRows
//                 //     });
//                 // } catch (err) {
//                 //     // handle error
//                 //     console.log(err)
//                 return average
//                 }

//     connection.query(sql, values, function(err) {

//         connection.end(); // close the connection

//         if (err) {
//             throw err;
//         }

//         // Execute the callback
//         next.apply(this, arguments);
//     });
// }

// module.exports = sqlConnection;

// module.exports = {

//     // makeDb: function () {
//     //     const connection = mysql.createConnection(dbConfig);
//     //     return {
//     //         query(sql, args) {
//     //             return util.promisify(connection.query)
//     //                 .call(connection, sql, args);
//     //         },
//     //         beginTransaction() {
//     //             return util.promisify(connection.beginTransaction)
//     //                 .call(connection);
//     //         },
//     //         commit() {
//     //             return util.promisify(connection.commit)
//     //                 .call(connection);
//     //         },
//     //         rollback() {
//     //             return util.promisify(connection.rollback)
//     //                 .call(connection);
//     //         },
//     //         close() {
//     //             return util.promisify(connection.end).call(connection);
//     //         }
//     //     };
//     // },
//     getAverageJourneyTime: async function (db) {
//         // const average = await con.query("SELECT AVG(`journeytimeseconds`) FROM " + tableName + " WHERE `depair`=\"LHR\" AND`destair`=\"DXB\""
//         // , (error, response) => {
//         //     // console.log(error, s2t(response[0]['AVG(`journeytimeseconds`)']));
//         //     // return s2t(response[0]['AVG(`journeytimeseconds`)'])
//         // }
//         // );
//         try {
//             await withTransaction(db, async () => {
//                 const someRows = await db.query('SELECT * FROM flighdata_B');
//                 // const otherRows = await db.query( 'SELECT * FROM other_table' );
//                 // do something with someRows and otherRows

//                 // console.log(someRows)
//                 return someRows
//             });
//         } catch (err) {
//             // handle error
//             console.log(err)
//         }



//         // return average
//         // [0]['AVG(`journeytimeseconds`)']
//     },

//     createTableAndPopulate: function (tableName) {

//         // create a new connection to the database
//         // const con = mysql.createConnection(dbConfig);

//         const typesFlightsFullCsv =
//             "`id` INT(7) NOT NULL, "
//             + "`depair` VARCHAR(3) NOT NULL, "
//             + "`destair` VARCHAR(3) NOT NULL, "
//             + "`indepartcode` VARCHAR(3), "
//             + "`inarrivecode` VARCHAR(3), "
//             + "`outflightno` VARCHAR(10) NOT NULL, "
//             + "`outdepartdate` DATE NOT NULL, "
//             + "`outdeparttime` TIME NOT NULL, "
//             + "`outarrivaldate` DATE NOT NULL, "
//             + "`outarrivaltime` TIME NOT NULL, "
//             + "`journeytimeseconds` INT(7), "
//             + "`outbookingclass` VARCHAR(20), "
//             + "`outflightclass` VARCHAR(30), "
//             + "`outcarriercode` VARCHAR(2), "
//             + "`inflightno` VARCHAR(10), "
//             + "`indepartdate` DATE, "
//             + "`indeparttime` TIME, "
//             + "`inarrivaldate` DATE, "
//             + "`inarrivaltime` TIME, "
//             + "`inbookingclass` VARCHAR(20), "
//             + "`inflightclass` VARCHAR(30), "
//             + "`incarriercode` VARCHAR(2), "
//             + "`originalprice` FLOAT, "
//             + "`originalcurrency` VARCHAR(5), "
//             + "`reservation` VARCHAR(10), "
//             + "`carrier` VARCHAR(30), "
//             + "`oneway` BOOLEAN, "
//             + "PRIMARY KEY (`id`)"

//         const typesFlightsSegmentsCsv =
//             "`flightid` INT(7) NOT NULL, "
//             + "`depcode` VARCHAR(3) NOT NULL, "
//             + "`arrcode` VARCHAR(3) NOT NULL, "
//             + "`depdate` DATE, "
//             + "`arrdate` DATE, "
//             + "`deptime` TIME NOT NULL, "
//             + "`arrtime` TIME NOT NULL, "
//             + "`depterminal` VARCHAR(3), "
//             + "`arrterminal` VARCHAR(3), "
//             + "`flightno` VARCHAR(8) NOT NULL,"
//             + "`journey` VARCHAR(3), "
//             + "`class` VARCHAR(30), "
//             + "`bookingclass` VARCHAR(30)"


//         const columnsFlightsFullCsv =
//             "id, depair, destair, indepartcode, inarrivecode, outflightno, outdepartdate, outdeparttime, "
//             + "outarrivaldate, outarrivaltime, journeytimeseconds, outbookingclass, outflightclass, outcarriercode, inflightno, "
//             + "indepartdate, indeparttime, inarrivaldate, inarrivaltime, inbookingclass, inflightclass, "
//             + "incarriercode, originalprice, originalcurrency, reservation, carrier, oneway";

//         const columnsFlightsSegmentsCsv =
//             "flightid, depcode, arrcode, depdate, arrdate, deptime, arrtime, "
//             + "depterminal, arrterminal, flightno, journey, class, bookingclass"

//         readCsvPopulateDB("../flighdata_B/flighdata_B.csv", "flighdata_B", typesFlightsFullCsv, columnsFlightsFullCsv);
//         // readCsvPopulateDB("../flighdata_B/flighdata_B_segments.csv", "flighdata_B_segments", typesFlightsSegmentsCsv, columnsFlightsSegmentsCsv);

//         // function jfk(airportCode) {
//         //     airportTimezone.filter(function (airport) {
//         //         return airport.code === airportCode;
//         //     })[0]
//         // }

//         // console.log(jfk('JFK'))


//     }
// };

// function readCsvPopulateDB(csv, tableName, sqlTypesFlights, sqlColumnsFlights) {
//     let stream = fs.createReadStream(csv);
//     let csvData = [];
//     let x = 0;
//     let csvStream = fastcsv
//         .parse()
//         .on("data", function (data) {
//             // data.shift();
//             data.forEach(function (item, i) {
//                 if (item == '') {
//                     data[i] = null;
//                 }
//                 if (x < 30) {
//                     // console.log(item)
//                     // console.log(data[columnsFull.depair])
//                     // console.log(data[x][columnsFull.inarrivaldate])
//                     x++;
//                 }
//             });
//             // for(z = 0; z<30; z++){
//             // console.log(data.)

//             // }
//             csvData.push(data);
//         })
//         .on("end", function () {
//             // remove the first line: header
//             csvData.shift();
//             for (rowIndex = 0; rowIndex < csvData.length; rowIndex++) {
//                 const row = csvData[rowIndex];
//                 const timeDiff = airportOffSetDifferenceHours(row[originalColumnsFull.depair], row[originalColumnsFull.destair]);
//                 // console.log(timeDiff)

//                 let journeyTimeSecondsTimezoneAdjusted = (new Date(row[originalColumnsFull.outarrivaldate] + ' ' + row[originalColumnsFull.outarrivaltime])
//                     - new Date(row[originalColumnsFull.outdepartdate] + ' ' + row[originalColumnsFull.outdeparttime])) / 1000 + 3600 * timeDiff
//                 // console.log(a)
//                 // console.log(s2t(a))
//                 // console.log(csvData[t])
//                 row.splice(modifiedColumnsFull.journeytimeseconds, 0, journeyTimeSecondsTimezoneAdjusted)
//                 // console.log(csvData[t])
//                 // let b = new Date()
//                 // b.setHours(3600*timeDiff)
//                 // console.log(3600 * timeDiff)
//                 // console.log(new Date().setHours(timeDiff))
//             }
//             populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights);
//         });
//     stream.pipe(csvStream);
// }

// function populateDb(tableName, csvData, sqlTypesFlights, sqlColumnsFlights) {

//     // open the connection
//     // con.connect(error => {
//     //     if (error) {
//     //         console.error(error);
//     //     }
//     //     else {
//     con.query("CREATE TABLE IF NOT EXISTS " + tableName + " (" + sqlTypesFlights + ") ENGINE = InnoDB;",
//         function (err, result) {
//             if (err)
//                 throw err;
//             console.log("TABLE created");
//         });

//     // con.query("SET SQL_MODE='ALLOW_INVALID_DATES'", (error, response) => {
//     //   console.log(error || response);
//     // });

//     con.query("TRUNCATE TABLE " + tableName, (error, response) => {
//         console.log(error, response);
//     });

//     con.query("INSERT INTO " + tableName + " (" + sqlColumnsFlights + ") VALUES ?", [csvData], (error, response) => {
//         console.log(error || response);
//     });
//     con.query("SHOW WARNINGS", (error, response) => {
//         console.log(error, response);
//     });



//     // con.end()
//     // }
//     // });
// }