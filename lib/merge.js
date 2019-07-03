// Returns if a value is a string
function isString (value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is an array
function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

// Returns if a value is an object
function isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

// Return the type of an object using above functions
function getType(obj) {
    if( isArray(obj) ) return 'array';
    else if( isObject(obj) ) return 'object';
    else return isString(obj)? 'string' : typeof obj;
}

// Receives an array of releases with the same OCID
function createRecord(ocid, releases) {
    let compiledRelease = {};

    // Sort the releases from oldest to newest
    releases = releases.sort( (a, b) => ( a.date > b.date )? 1 : -1 );

    for(var i=0; i<releases.length; i++) {
        compiledRelease = mergeRelease(compiledRelease, releases[i]);
    }

    // Construct the final record
    let record = {
        uri: "https://api.quienesquien.wiki/v2/contracts/" + ocid,
        version: "1.1.4",
        extensions: [
            "https://raw.githubusercontent.com/transpresupuestaria/ocds_contract_data_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting-extensions/ocds_partyDetails_scale_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting/ocds_budget_breakdown_extension/master/extension.json",
            "https://raw.githubusercontent.com/open-contracting-extensions/ocds_memberOf_extension/master/extension.json",
            "https://raw.githubusercontent.com/transpresupuestaria/ocds_budget_classifications_extension/master/extension.json",
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
        records: {
            compiledRelease: compiledRelease,
            ocid: ocid,
            releases: releases
        }
    }

    return record;
}

function mergeRelease(compiledRelease, release) {
    if(!release) return compiledRelease;
    Object.keys(release).map( (key) => {
        let type = getType(release[key]);
        switch( type ) {
            case 'object':
                mergeObject(key, compiledRelease, release);
                break;
            case 'array':
                mergeArray(key, compiledRelease, release);
                break;
            default:
                mergeProperty(key, compiledRelease, release);
                break;
        }
    } );
    return compiledRelease;
}

function mergeArray(key, compiledRelease, release) {
    if(!compiledRelease.hasOwnProperty(key)) {
        assignObject(key, compiledRelease, release);
    }
    else {
        if(release[key][0] && release[key][0].hasOwnProperty('id')) { // El array es un listado de objetos con ID (parties, contracts, etc)
            release[key].map( (item) => {
                if(item.hasOwnProperty('id')) {
                    let itemID = item.id;
                    let found = false;
                    // Buscar objeto con el mismo ID, si existe merge
                    compiledRelease[key].map( (compiledItem) => {
                        if(compiledItem.id == itemID) {
                            found = true;
                            mergeRelease(compiledItem, item);
                        }
                    } );
                    // Si no existe agregarlo
                    if(found == false) {
                        compiledRelease[key].push(item);
                    }
                }
            } );
        }
        else { // Es un codeList, reemplazar
            compiledRelease[key] = release[key];
        }
    }
}

function mergeObject(key, compiledRelease, release) {
    if(!compiledRelease.hasOwnProperty(key)) {
        assignObject(key, compiledRelease, release);
    }
    else {
        compiledRelease[key] = mergeRelease(compiledRelease[key], release[key]);
    }
}

function mergeProperty(key, compiledRelease, release) {
    if(compiledRelease.hasOwnProperty(key)) {
        if(compiledRelease[key] != release[key]) {
            compiledRelease[key] = release[key];
        }
    }
    else {
        assignObject(key, compiledRelease, release);
    }
}

function assignObject(key, compiledRelease, release) {
    let a = {};
    a[key] = release[key];
    Object.assign(compiledRelease, a);
}

module.exports = createRecord;
