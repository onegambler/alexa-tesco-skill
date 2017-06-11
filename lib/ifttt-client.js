'use strict';

const async = require('async');

function IftttClient(url, key, request) {
    this.searchUrl = `${url}/tesco_search/with/key/${key}`;
    this.request = request;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(item, quantity, callback) {
    const id = item.id || item.name;

    const self = this;
    const requestBody = { json: true, body: { value1: `${id}` } };
    async.times(quantity || 1, function asyncFunction(n, next) {
        self.request.post(self.searchUrl, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
