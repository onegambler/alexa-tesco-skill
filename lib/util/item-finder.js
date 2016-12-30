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
    const item = slots.item.value;
    const itemId = this._itemRepository.getItemIdentifier(item);

    if (item && !itemId) {
        const fuzzyItem = this._fuzzy.findBestMatch(item);
        if (fuzzyItem) {
            const id = this._itemRepository.getItemIdentifier(fuzzyItem);
            this.emit('fuzzyFound', { id, value: fuzzyItem, quantity });
        } else {
            this.emit('notFound');
        }
    } else if (itemId) {
        this.emit('found', { id: itemId, value: item, quantity });
    } else {
        this.emit('notFound', { value: item });
    }
};

module.exports = ItemFinder;
