const mysql = require('mysql');
const fs = require('fs');
const fastcsv = require('fast-csv');
module.exports = {
    createTableAndPopulate: function (tableName) {

        // create a new connection to the database
        const con = mysql.createConnection({
            host: "sql2.freemysqlhosting.net",
            database: "sql2368079",
            user: "sql2368079",
            password: "hK3*hZ6!",
            port: 3306
        });

        let stream = fs.createReadStream("../flighdata_B/flighdata_B.csv");
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

                // open the connection
                con.connect(error => {
                    if (error) {
                        console.error(error);
                    }
                    else {

                        // con.connect(function (err) {
                        //   if (err) throw err;
                        //   console.log("Connected!");
                        con.query("CREATE TABLE IF NOT EXISTS " + tableName + " ( "
                            + "`id` INT(7) NOT NULL, "
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
                            + "PRIMARY KEY (`id`)) ENGINE = InnoDB;",
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

                        let query = "INSERT INTO " + tableName + " ("
                            + "id, depair, destair, indepartcode, inarrivecode, outflightno, outdepartdate, outdeparttime, "
                            + "outarrivaldate, outarrivaltime, outbookingclass, outflightclass, outcarriercode, inflightno, "
                            + "indepartdate, indeparttime, inarrivaldate, inarrivaltime, inbookingclass, inflightclass, "
                            + "incarriercode, originalprice, originalcurrency, reservation, carrier, oneway) VALUES ?";
                        con.query(query, [csvData], (error, response) => {
                            console.log(error || response);
                        });
                        con.query("SHOW WARNINGS", (error, response) => {
                            console.log(error, response);
                        });
                    }
                });
            });
        stream.pipe(csvStream);
    }
};