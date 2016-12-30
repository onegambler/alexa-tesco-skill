'use strict';

exports.fuzzySearchOptions = {
    include: ['score'],
    shouldSort: true,
    threshold: 0.7,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: []
};
