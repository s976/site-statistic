/**
 * Allowed sites
 * @type {*[]}
 */
let sites = [
    'dev.dinonline.org',
    'dinonline.org',
    'din.org.il'
];

/**
 * Skip follow url (don't record it)
 * @type {*[]}
 */
let block = [
    "your-question-has-been-sent-successfully",
    "preview=",
    "&",
    "s=",
    "q="
];

let settings = {
    sites : sites,
    block : block,
    anotherPort : undefined, //May be overwritten by InitialSetup (if port provided in args e.g. "node www --port=3000")
    expireTime : 5, //minutes. Visits to take into account for "Last Visits"
    updateSummaryInterval : 10 //seconds
};

module.exports = settings;