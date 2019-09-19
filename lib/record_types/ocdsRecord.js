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

    return record;
}

function getIDFieldName() {
    return 'ocid';
}

module.exports = { recordCreator, getIDFieldName };
