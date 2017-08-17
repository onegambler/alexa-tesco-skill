'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('request');

const expect = chai.expect;
const IftttClient = require('../lib/ifttt-client');

chai.use(sinonChai);

const ITEM_ID = 'id';
const ITEM_NAME = 'banana';
const URL = 'URL';
const KEY = 'key';

const SEARCH_URL = `${URL}/tesco_search/with/key/${KEY}`;

describe('Ifttt client', () => {
    beforeEach(() => {
        this.post = sinon.stub(request, 'post');
        this.iftttClient = new IftttClient(URL, KEY, request);
    });

    afterEach(() => {
        this.post.restore();
    });

    it('should add ONE item to the basket if quantity is undefined', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket({ id: ITEM_ID, name: ITEM_NAME }, undefined, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(SEARCH_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE item to the basket if quantity is null', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket({ id: ITEM_ID, name: ITEM_NAME }, null, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(SEARCH_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE items to the basket if quantity is one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket({ id: ITEM_ID, name: ITEM_NAME }, 1, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(SEARCH_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add MULTIPLE items to the basket if quantity is more than one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket({ id: ITEM_ID, name: ITEM_NAME }, 3, callback);
        expect(this.post).to.have.been.calledThrice.calledWith(SEARCH_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should search by name and add ONE item to the basket if id is undefined', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_NAME } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasket({ id: undefined, name: ITEM_NAME }, undefined, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(SEARCH_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });
});

