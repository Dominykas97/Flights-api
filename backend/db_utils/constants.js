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

module.exports = Object.freeze({
    originalColumnsFull: originalColumnsFull,
    modifiedColumnsFull: modifiedColumnsFull,
    originalColumnsSegments: originalColumnsSegments,
    modifiedColumnsSegments: modifiedColumnsSegments,
    typesFlightsFullCsv: typesFlightsFullCsv,
    typesFlightsSegmentsCsv: typesFlightsSegmentsCsv,
    columnsFlightsFullCsv: columnsFlightsFullCsv,
    columnsFlightsSegmentsCsv: columnsFlightsSegmentsCsv
});
