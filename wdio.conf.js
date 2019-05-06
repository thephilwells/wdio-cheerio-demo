exports.config = {
    runner: 'local',
    region: 'us',
    specs: [
        './test/specs/**/*.js'
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
    }],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'https://www.nytimes.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    reporters: ['spec'],

    before: function () {
        var chai = require('chai');
        global.expect = chai.expect;
        chai.Should();
    }
}
