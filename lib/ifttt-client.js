'use strict';

const request = require('request');

const IftttClient = function IftttClient(url) {
    this.url = url;
    const self = this;

    function addItem(itemId, callback) {
        const requestBody = { json: true, body: { value1: itemId } };
        request.post(self.url, requestBody, function cb(error, response, body) {
            if (error) {
                return callback(error);
            }
            return callback(null);
        });
    }

    return {
        addItem
    };
};

module.exports = IftttClient;
