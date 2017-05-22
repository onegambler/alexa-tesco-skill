'use strict';

const async = require('async');

const addUrl = `${this.url}/tesco_item/with/key/${this.key}`;
const searchUrl = `${this.url}/tesco_search/with/key/${this.key}`;

function IftttClient(url, key, request) {
    this.url = url;
    this.key = key;
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
        self.request.post(addUrl, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

IftttClient.prototype.addItemToBasketFromName = function addItemToBasketFromName(itemName, quantity, callback) {
    const self = this;
    const requestBody = { json: true, body: { value1: itemName } };
    async.times(quantity || 1, function asyncFunction(n, next) {
        self.request.post(searchUrl, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
