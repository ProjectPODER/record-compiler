# OCDS Record Compiler

This script takes a list of unique *id* strings separated by newline (**\n**) from stdin and returns JSON record objects, one object per line. The objects are usually of type [OCDS Record](http://standard.open-contracting.org/latest/en/schema/records_reference/) through *stdout*, compiled from [releases](http://standard.open-contracting.org/latest/en/schema/reference/) contained in the specified Mongo collections. This script can also be used to compile records for the Popolo data standard, and custom types can also be defined.

## Usage

    node index.js -d DATABASE -c COLLECTION1 COLLECTION2 -r RECORD_TYPE

This script is used along with [ocds-unique](http://gitlab.rindecuentas.org/equipo-qqw/ocds-unique) to perform record compilation inside [Poppins](http://gitlab.rindecuentas.org/equipo-qqw/poppins) and then served through the [QQW API](http://gitlab.rindecuentas.org/equipo-qqw/QuienEsQuienApi).

## Options

    --database      -d  Name of Mongo database.
    --collections   -c  List of Mongo collections.
    --recordType    -r  Which compilation procedure to use.
    --host          -h  Mongo host (defaults to localhost).
    --port          -p  Mongo port (defaults to 27017).

## Output

The script outputs JSON objects of the specified record type, one object per line.

## Record types

Record types are defined inside the *lib/record_types/* folder. The file must be named exampleRecord.js for records of type **example**, and invoked using the -r parameter.

OCDS records are compiled using the published [merging strategy](https://standard.open-contracting.org/latest/en/schema/merging/), and other record types should also follow this methodology.

A custom record type should implement two functions: **recordCreator** and **getIDFieldName**.

- recordCreator: receives 3 parameters (id string, compiledRelease object, releases array) and should return a JSON record object.
- getIDFieldName: returns a string specifying the field to use for compilation.
