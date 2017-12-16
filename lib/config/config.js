'use strict';

exports.fuzzySearchOptions = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: false,
    includeScore: true,
    threshold: 0.5,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: []
};
