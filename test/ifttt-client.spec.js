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
const KEY = 'key';

const ADD_URL = `${URL}/tesco_item/with/key/${KEY}`;
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
        this.iftttClient.addItemToBasketFromId(ITEM_ID, undefined, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(ADD_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE item to the basket if quantity is null', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasketFromId(ITEM_ID, null, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(ADD_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add ONE items to the basket if quantity is one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasketFromId(ITEM_ID, 1, callback);
        expect(this.post).to.have.been.calledOnce.calledWith(ADD_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });

    it('should add MULTIPLE items to the basket if quantity is more than one', (done) => {
        const callback = sinon.spy();
        const expectedRequestBody = { json: true, body: { value1: ITEM_ID } };
        this.post.callsArgWith(2, null, null, null);
        this.iftttClient.addItemToBasketFromId(ITEM_ID, 3, callback);
        expect(this.post).to.have.been.calledThrice.calledWith(ADD_URL, expectedRequestBody);
        expect(callback).to.have.been.calledOnce.calledWith(null);
        done();
    });
});

