'use strict';

const Fuse = require('fuse.js');
const itemsRepo = require('../repository/item-repository');

const fuseOptions = {
    include: ['score'],
    shouldSort: true,
    threshold: 0.7,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: []
};

const items = itemsRepo.getAllItems();

const FuzzySearch = module.exports = exports;

const fuse = new Fuse(items, fuseOptions); // "list" is the item array

FuzzySearch.findBestMatch = function findBestMatch(string) {
    const result = fuse.search(string);
    if (result && result.length > 0) {
        return items[result[0].item];
    }
    return null;
};

