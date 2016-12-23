'use strict';

const chai = require('chai');

const expect = chai.expect;
const messageBuilder = require('../../lib/util/message-builder');


describe('Message builder', () => {

    it('should build item  added to basket response with quantity if present', (done) => {
        const item = 'banana';
        const quantity = 3;
        const error = null;
        const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
        expect(message).to.deep.equal('I added 3 banana to the basket');
        done();
    });

    it('should build item  added to basket response WITHOUT quantity if NOT present', (done) => {
        const item = 'banana';
        const quantity = null;
        const error = null;
        const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
        expect(message).to.deep.equal('I added banana to the basket');
        done();
    });

    it('should build error message response if error is defined', (done) => {
        const item = 'banana';
        const quantity = null;
        const error = {};
        const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
        expect(message).to.deep.equal('Something went wrong');
        done();
    });

    it('should properly build item not found message', (done) => {
        const item = 'banana';
        const message = messageBuilder.buildNotFoundResponseMessage(item);
        expect(message).to.deep.equal(`Item ${item} was not found. Please set up a mapping`);
        done();
    });
});

