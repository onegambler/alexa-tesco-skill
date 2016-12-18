'use strict';

const request = require('request');

function IftttClient(url) {
    this._url = url;
}

IftttClient.prototype.addItemToBasket = function (itemId, callback) {
    const requestBody = { json: true, body: { value1: itemId } };
    request.post(this._url, requestBody, function cb(error, response, body) {
        if (error) {
            return callback(error);
        }
        return callback(null);
    });
};

module.exports = IftttClient;
