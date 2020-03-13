function recordCreator(id, compiledRelease, releases) {
    let record = {
        id: id,
        releases: releases,
        compiledRelease: compiledRelease
    }
    
    return record;
}

function getIDFieldName() {
    return 'id';
}

module.exports = { recordCreator, getIDFieldName };
