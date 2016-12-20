'use strict';

const async = require('async');
const request = require('request');

function IftttClient(url) {
    this._url = url;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(itemId, quantity, callback) {
    async.times(quantity || 1, function asyncFunction(n, next) {
        const requestBody = {json: true, body: { value1: itemId } };
        request.post(this._url, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
