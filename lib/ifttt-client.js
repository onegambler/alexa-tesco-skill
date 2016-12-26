'use strict';

const async = require('async');

function IftttClient(url, request) {
    this.url = url;
    this.request = request;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(itemId, quantity, callback) {
    const self = this;
    async.times(quantity || 1, function asyncFunction(n, next) {
        const requestBody = { json: true, body: { value1: itemId } };
        self.request.post(self.url, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
