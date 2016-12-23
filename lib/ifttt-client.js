'use strict';

const async = require('async');

function IftttClient(url, request) {
    this._url = url;
    this._request = request;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(itemId, quantity, callback) {
    const self = this;
    async.times(quantity || 1, function asyncFunction(n, next) {
        const requestBody = { json: true, body: { value1: itemId } };
        self._request.post(self._url, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
