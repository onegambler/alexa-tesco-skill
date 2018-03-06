'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;
const ItemFinder = require('../../lib/util/item-finder');

function createAddItemIntent(item) {
    return {
        slots: {
            item: {
                value: item
            }
        }
    };
}

describe('Item finder util', () => {
    beforeEach(() => {
        this.getItemIdentifier = sinon.stub();
        this.containsItem = sinon.stub();
        this.itemRepository = {
            getAllItems: function getAllItems() {
                return ['banana', 'milk', 'pineapple', 'cereals'];
            },
            getItemIdentifier: this.getItemIdentifier,
            containsItem: this.containsItem
        };
        this.itemFinder = new ItemFinder(this.itemRepository);
        this.emitSpy = sinon.spy(this.itemFinder, 'emit');
    });

    afterEach(() => {
        this.emitSpy.restore();
    });

    it('should emit "found" if item is mapped to an existing SKILL_ID', (done) => {
        this.getItemIdentifier.withArgs('banana').returns('234');
        this.containsItem.withArgs('banana').returns(true);
        this.itemFinder.process(createAddItemIntent('banana').slots);
        expect(this.emitSpy).to.have.been.calledOnce.calledWith('found',
            { id: '234', name: 'banana', quantity: null });
        done();
    });

    it('should emit "not found" if item is null or undefined', (done) => {
        this.itemFinder.process(createAddItemIntent(null).slots);
        expect(this.emitSpy).to.have.been.calledOnce.calledWith('notFound');
        done();
    });

    it('should emit "not found" if item is not mapped and fuzzy search does not find a match', (done) => {
        this.containsItem.withArgs('xxx').returns(null);
        this.itemFinder.process(createAddItemIntent('xxx').slots);
        expect(this.emitSpy).to.have.been.calledOnce.calledWith('notFound');
        done();
    });

    it('should emit "fuzzyFound" if item is not mapped and fuzzy search finds a match', (done) => {
        const captureName = 'bannana';
        const expectedName = 'banana';
        this.getItemIdentifier.withArgs(expectedName).returns('234');
        this.containsItem.withArgs(expectedName).returns(true);
        this.itemFinder.process(createAddItemIntent(captureName).slots);
        expect(this.emitSpy).to.have.been.calledOnce.calledWith('fuzzyFound', captureName,
            { id: '234', name: expectedName, quantity: null });
        done();
    });
});

