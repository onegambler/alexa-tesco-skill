'use strict';

module.exports = {
    accessKeyId: '',  // optional
    secretAccessKey: '',  // optional
    sessionToken: '',  // optional
    profile: '', // optional for loading AWS credientail from custom profile
    region: 'eu-west-1',
    handler: 'index.handler',
    role: 'alexa',
    functionName: '',
    timeout: 10,
    memorySize: 128,
    publish: true, // default: false,
    runtime: 'nodejs4.3'
};
