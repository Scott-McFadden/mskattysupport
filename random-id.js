const debug = require('debug');
const log = debug('mylib:randomid');

log('library loaded');

function getRandomId() {
    log("computing random ID");
    const outcome = Math.random()
        .toString(36)
        .substring(2);
    log('Random ID is "%s"', outcome);
    return outcome;

}

module.exports = {getRandomId };
