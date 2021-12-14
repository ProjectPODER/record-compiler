const BSON = require('bson');

function recordCreator(ocid, compiledRelease, releases) {
    let record = {
        ocid: ocid,
        releases: releases,
        compiledRelease: compiledRelease
    }

    // Agregar campo con la suma de todos los contratos al compiledRelease
    let contracts_total = 0;
    compiledRelease.contracts.map( (contract) => {
        contracts_total += parseFloat(contract.value.amount);
    } );
    Object.assign(record.compiledRelease, { total_amount: contracts_total });

    // Check object size, if greater than 16MB (Mongo limit) remove releases
    let recordSize = BSON.calculateObjectSize(record);
    if(recordSize > 16793600) {
        // Aquí hay que reducir el tamaño hasta que quepa en Mongo
    }

    return record;
}

function getIDFieldName() {
    return 'ocid';
}

module.exports = { recordCreator, getIDFieldName };
