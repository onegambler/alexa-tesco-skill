'use strict';

const async = require('async');

function IftttClient(url, key, request) {
    this.addUrl = `${url}/tesco_item/with/key/${key}`;
    this.searchUrl = `${url}/tesco_search/with/key/${key}`;
    this.request = request;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(item, quantity, callback) {
    if (item.id) {
        this.addItemToBasketFromId(item.id, quantity, callback);
    } else {
        this.addItemToBasketFromName(item.name, quantity, callback);
    }
};

IftttClient.prototype.addItemToBasketFromId = function addItemToBasketFromId(itemId, quantity, callback) {
    const self = this;
    const requestBody = { json: true, body: { value1: itemId } };
    async.times(quantity || 1, function asyncFunction(n, next) {
        self.request.post(self.addUrl, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

IftttClient.prototype.addItemToBasketFromName = function addItemToBasketFromName(itemName, quantity, callback) {
    const self = this;
    const requestBody = { json: true, body: { value1: itemName } };
    async.times(quantity || 1, function asyncFunction(n, next) {
        self.request.post(self.searchUrl, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
