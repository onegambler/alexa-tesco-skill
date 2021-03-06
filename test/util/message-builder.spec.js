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

    it('should properly build wrong request message', (done) => {
        const message = messageBuilder.buildWrongRequestMessage();
        expect(message).to.deep.equal('I am not sure what you mean by that');
        done();
    });

    it('should build try anyway question with item and no quantity', (done) => {
        const item = 'banana';
        const quantity = null;
        const message = messageBuilder.buildTryAnywayQuestion(item, quantity);
        expect(message)
            .to.deep.equal(`I didn\'t recognise the product. Do you still want me to add ${item} to the basket?`);
        done();
    });

    it('should build try anyway question with item and quantity', (done) => {
        const item = 'banana';
        const quantity = 4;
        const message = messageBuilder.buildTryAnywayQuestion(item, quantity);
        expect(message).to.deep
            .equal(`I didn\'t recognise the product. Do you still want me to add ${quantity} ${item} to the basket?`);
        done();
    });
});

