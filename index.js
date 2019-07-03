#!/usr/bin/env node
var hrstart = process.hrtime();
var hrend = 0;

const JSONStream = require('JSONStream');
const es = require('event-stream');
const monk = require('monk');
const commandLineArgs = require('command-line-args');
const processOCIDs = require('./lib/releases.js')

const optionDefinitions = [
  { name: 'sources', alias: 's', type: String, multiple: true },
  { name: 'database', alias: 'd', type: String }
];

const args = commandLineArgs(optionDefinitions);

if(!args.database || !args.sources ) {
    console.log('ERROR: missing parameters.');
    process.exit(1);
}

process.stdin.setEncoding('utf8');

const url = 'mongodb://localhost:27017/' + args.database;
const db = monk(url);
const sources = [];
args.sources.map( (source) => { sources.push(db.get(source)); } )
const ocids = [];

process.stdin
    .pipe(es.split())
    .pipe(es.mapSync(function (ocid) {
        if(ocid) ocids.push(ocid);
    }));

process.stdin.on('end', () => {
    processOCIDs(ocids, sources).then( () => {
        // hrend = process.hrtime(hrstart);
        // console.log('Duration: ' + hrend[0] + '.' + hrend[1] + 's');
        process.exit();
    })
    .catch( (e) => { console.log(e); } ); // In case of error...
});
