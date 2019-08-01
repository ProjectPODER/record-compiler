const mergeRelease = require('./merge.js');
let recordCreator = null;

// Create records of recordType from releases with unique identifier
async function processQueue(queue, sources, recordType) {
    recordCreator = require('./record_types/' + recordType + 'Record');

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

async function getAllReleases(ocid, sources) {
    let releases = [];
    // Get all releases with same ocid from list of sources
    for(let i=0; i<sources.length; i++) {
        let results = await getReleases(ocid, sources[i]);
        releases = releases.concat(results);
    }
    return releases;
}

async function getReleases(ocid, source) {
    let releases = await source.find({ 'ocid': ocid });
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
        compiledRelease = mergeRelease(compiledRelease, releases[i]);
    }

    // Construct the final record
    let record = recordCreator(id, compiledRelease, releases);

    return record;
}

module.exports = processQueue;
