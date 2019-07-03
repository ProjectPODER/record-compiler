const createRecord = require('./merge.js');
let processed = 0;

async function processOCIDs(ocids, sources) {
    for(let i=0; i<ocids.length; i++) {
        let releases = await getAllReleases(ocids[i], sources);
        // Send array of releases and merge into a record
        let record = createRecord(ocids[i], releases);
        // processed++;
        process.stdout.write(JSON.stringify(record));
        process.stdout.write('\n');
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

module.exports = processOCIDs;
