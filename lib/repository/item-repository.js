'use strict';

const items = require('./products.json');

const ItemRepository = module.exports = exports;

ItemRepository.getItemIdentifier = function getItemIdentifier(itemName) {
    return items[itemName];
};

ItemRepository.getAllItems = function getAllItems() {
    return Object.keys(items);
};
