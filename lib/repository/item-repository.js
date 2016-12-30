'use strict';
const fs = require('fs');

const items = JSON.parse(fs.readFileSync('../../data/products.json', 'utf8'));

const ItemRepository = module.exports = exports;

ItemRepository.getItemIdentifier = function getItemIdentifier(itemName) {
    return items[itemName];
};

ItemRepository.getAllItems = function getAllItems() {
    return Object.keys(items);
};
