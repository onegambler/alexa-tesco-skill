'use strict';

const async = require('async');

function IftttClient(url, key, request) {
    this.addUrl = `${url}/tesco_item/with/key/${key}`;
    this.searchUrl = `${url}/tesco_search/with/key/${key}`;
    this.request = request;
}

IftttClient.prototype.addItemToBasket = function addItemToBasket(item, quantity, callback) {
    const url = item.id ? this.addUrl : this.searchUrl;
    const id = item.id || item.name;

    const self = this;
    const requestBody = { json: true, body: { value1: `${id}` } };
    async.times(quantity || 1, function asyncFunction(n, next) {
        self.request.post(url, requestBody, function cb(error, response, body) {
            next(error);
        });
    }, callback);
};

module.exports = IftttClient;
