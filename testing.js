const fs = require('fs');
const createRecord = require('./lib/merge.js');

let rawdata = fs.readFileSync('tester.json');
let releases = JSON.parse(rawdata);

let record = createRecord(releases[0].ocid, releases);

console.log(JSON.stringify(record, null, 4));
