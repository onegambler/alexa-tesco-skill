'use strict';

const fs = require('fs');

const items = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

const ItemRepository = module.exports = exports;

ItemRepository.getItemIdentifier = function getItemIdentifier(itemName) {
    return itemName && items[itemName.toLowerCase()];
};

ItemRepository.containsItem = function containsItem(itemName) {
    return itemName && Object.prototype.hasOwnProperty.call(items, itemName.toLowerCase());
};

ItemRepository.getAllItems = function getAllItems() {
    return Object.keys(items);
};
