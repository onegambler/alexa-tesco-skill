'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('request');

const expect = chai.expect;
const IftttClient = require('../lib/ifttt-client');

chai.use(sinonChai);

const ITEM_ID = 'id';
const URL = 'URL';

describe('Item finder util', () => {
    beforeEach(() => {
        this.post = sinon.stub(request, 'post');
        this.iftttClient = new IftttClient(URL, request);
    });

    afterEach(() => {
        this.post.restore();
    });

    it('should add ONE item to the basket if quantity is undefined', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket(ITEM_ID, undefined, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE item to the basket if quantity is null', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket(ITEM_ID, null, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE items to the basket if quantity is one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket(ITEM_ID, 1, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add MULTIPLE items to the basket if quantity is more than one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket(ITEM_ID, 3, callback);
        expect(this.post).to.have.been.calledThrice.calledWith(URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });
});

