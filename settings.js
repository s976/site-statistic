/**
 * Allowed sites
 * @type {*[]}
 */
let sites = [
    'http://dev.dinonline.org',
    'http://dinonline.org',
    'http://din.org.il'
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
    port : 80 //May be overwritten by InitialSetup (if port provided in args e.g. "node www --port=3000")
};

module.exports = settings;