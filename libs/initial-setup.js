const yargs = require('yargs');
let settings = require('../settings');

class InitialSetup{
    constructor(){
        this.setPort();
    }

    setPort(){
        if(yargs.argv.port){
            settings.port = yargs.argv.port;
        }
    }

}

module.exports = new InitialSetup();