/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');

const expect = chai.expect;
const FuzzySearch = require('../../lib/util/fuzzy-search');

describe('Fuzzy search util', () => {
    this.items = ['banana', 'milk', 'pineapple', 'cereals'];
    it('should return the best match over multiple values', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch('bananas');
        expect(result).to.deep.equal('banana');
        done();
    });

    it('should return the best match over multiple values when they differ for more than one character', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch('cereal bars');
        expect(result).to.deep.equal('cereals');
        done();
    });

    it('should return nothing if word to match is too different', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch('xxxxxxxx');
        expect(result).to.be.null;
        done();
    });

    it('should return nothing if word to match is empty', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch('');
        expect(result).to.be.null;
        done();
    });

    it('should return nothing if word to match is undefined', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch(undefined);
        expect(result).to.be.null;
        done();
    });

    it('should return nothing if word to match is null', (done) => {
        const search = new FuzzySearch(this.items);
        const result = search.findBestMatch(null);
        expect(result).to.be.null;
        done();
    });
});
