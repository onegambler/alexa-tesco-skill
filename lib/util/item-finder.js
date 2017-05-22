'use strict';

const FuzzySearch = require('../util/fuzzy-search');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const ItemFinder = function ItemFinder(itemRepository) {
    this._itemRepository = itemRepository;
    this._fuzzy = new FuzzySearch(itemRepository.getAllItems());
};

util.inherits(ItemFinder, EventEmitter);

ItemFinder.prototype.process = function process(slots) {
    const quantity = slots.quantity ? slots.quantity.value : null;
    const itemName = slots.item.value;
    const itemId = this._itemRepository.getItemIdentifier(itemName);

    if (itemName && !itemId) {
        const fuzzyItemName = this._fuzzy.findBestMatch(itemName);
        if (fuzzyItemName) {
            const id = this._itemRepository.getItemIdentifier(fuzzyItemName);
            this.emit('fuzzyFound', { id, name: fuzzyItemName, quantity });
        } else {
            this.emit('notFound');
        }
    } else if (itemId) {
        this.emit('found', { id: itemId, name: itemName, quantity });
    } else {
        this.emit('notFound', { name: itemName });
    }
};

module.exports = ItemFinder;
