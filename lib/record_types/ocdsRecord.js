function recordCreator(ocid, compiledRelease, releases) {
    let record = {
        uri: "https://api.quienesquien.wiki/v2/contracts/" + ocid,
        version: "1.1",
        extensions: [
            "https://raw.githubusercontent.com/transpresupuestaria/ocds_contract_data_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting-extensions/ocds_partyDetails_scale_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting/ocds_budget_breakdown_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting-extensions/ocds_memberOf_extension/master/extension.json",
            "https://raw.githubusercontent.com/ProjectPODER/ocds_compranet_extension/master/extension.json"
        ],
        publisher: {
            name: "QuienEsQuien.wiki",
            uri: "https://quienesquien.wiki/"
        },
        license: "https://creativecommons.org/licenses/by-sa/4.0/deed.es",
        publicationPolicy: "https://quienesquien.wiki/about",
        publishedDate: releases[releases.length - 1].date,
        // packages: [],
        records: [
            {
                ocid: ocid,
                releases: releases,
                compiledRelease: compiledRelease
            }
        ]
    }

    // Agregar campo con la suma de todos los contratos al compiledRelease
    let contracts_total = 0;
    compiledRelease.contracts.map( (contract) => {
        contracts_total += parseFloat(contract.value.amount);
    } );
    Object.assign(record.records[0].compiledRelease, { total_amount: contracts_total });

    return record;
}

module.exports = recordCreator;
