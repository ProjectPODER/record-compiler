const clonedeep = require('lodash.clonedeep');
const mergeRelease = require('./merge.js');
let recordCreator = null;
let getIDFieldName = null;

// Create records of recordType from releases with unique identifier
async function processQueue(queue, sources, recordType) {
    recordCreator = require('./record_types/' + recordType + 'Record').recordCreator;
    getIDFieldName = require('./record_types/' + recordType + 'Record').getIDFieldName;

    for(let i=0; i<queue.length; i++) {
        // Search sources for releases with same unique identifier
        let releases = await getAllReleases(queue[i], sources);

        if(releases.length > 0) {
            // Send array of releases and merge into a record
            let record = createRecord(queue[i], releases, recordType);
            // Output record for all the world to see
            process.stdout.write(JSON.stringify(record));
            process.stdout.write('\n');

            record = null;
            releases = null;
        }
    }
}

async function getAllReleases(id, sources) {
    let releases = [];
    // Get all releases with same ocid from list of sources
    for(let i=0; i<sources.length; i++) {
        let results = await getReleases(id, sources[i]);
        releases = releases.concat(results);
    }
    return releases;
}

async function getReleases(id, source) {
    let idField = getIDFieldName();
    let releases = await source.find({ [idField]: id });
    return releases;
}

// Receives an array of releases with the same OCID
function createRecord(id, releases, recordType) {
    let compiledRelease = {};

    // Sort the releases from oldest to newest
    releases = releases.sort( (a, b) => ( a.date > b.date )? 1 : -1 );

    for(var i=0; i<releases.length; i++) {
        // Remove _id property from release
        delete releases[i]._id;
        let tempRelease = clonedeep(releases[i]);
        compiledRelease = mergeRelease(compiledRelease, tempRelease);
    }

    // Construct the final record
    let record = recordCreator(id, compiledRelease, releases);

    return record;
}

module.exports = processQueue;
