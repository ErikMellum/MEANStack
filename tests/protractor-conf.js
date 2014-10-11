exports.config = {
allScriptsTimeout: 11000,
specs: [
'e2e/*.js'
],
capabilities: {
'browserName': 'chrome'
},
chromeOnly: true,
baseUrl: 'http://0.0.0.0:3000/',
framework: 'jasmine',
jasmineNodeOpts: {
defaultTimeoutInterval: 30000
}
};
