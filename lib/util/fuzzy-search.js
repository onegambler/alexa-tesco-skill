'use strict';

const Fuse = require('fuse.js');
const itemsRepo = require('../repository/item-repository');

const fuseOptions = {
    include: ['score'],
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 50,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: []
};

const items = itemsRepo.getAllItems();

const FuzzySearch = module.exports = exports;

const fuse = new Fuse(items, fuseOptions); // "list" is the item array

FuzzySearch.findBestMatch = function findBestMatch(string) {
    const result = fuse.search(string);
    if (result) {
        return items[result.item];
    }

    return null;
};

