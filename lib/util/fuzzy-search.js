'use strict';

const config = require('../config/config');
const Fuse = require('fuse.js');

function FuzzySearch(items) {
    this._items = items;
    this._fuse = new Fuse(items, config.fuzzySearchOptions);
}

FuzzySearch.prototype.findBestMatch = function findBestMatch(string) {
    const result = this._fuse.search(string || '');
    console.info(`Fuzzy search of ${string}. Best matches: ${result.map(res => res.item).join(',')}`);
    if (result && result.length > 0) {
        return this._items[result[0].item];
    }
    return null;
};

module.exports = FuzzySearch;

