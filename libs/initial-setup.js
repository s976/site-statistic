const yargs = require('yargs');
let settings = require('../settings');

class InitialSetup{
    constructor(){
        this.setPort();
    }

    setPort(){
        if(yargs.argv.port){
            settings.anotherPort = yargs.argv.port;
        }
    }

}

module.exports = new InitialSetup();