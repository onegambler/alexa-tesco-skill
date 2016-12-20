'use strict';

const fuzzy = require('../../lib/util/fuzzy-search');
const itemsRepo = require('../../lib/repository/item-repository');

const result = fuzzy.findBestMatch('a movie');
console.info(`Result ${result}`);
