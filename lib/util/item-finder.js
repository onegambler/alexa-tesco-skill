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

    if (this._itemRepository.containsItem(itemName)) {
        const itemId = this._itemRepository.getItemIdentifier(itemName);
        this.emit('found', { id: itemId, name: itemName, quantity });
    } else if (itemName) {
        const fuzzyItemName = this._fuzzy.findBestMatch(itemName);
        console.info(`Couldn't find product ${itemName}. Best match: ${fuzzyItemName}`);
        if (fuzzyItemName) {
            const itemId = this._itemRepository.getItemIdentifier(fuzzyItemName);
            this.emit('fuzzyFound', { id: itemId, name: fuzzyItemName, quantity });
        } else {
            this.emit('notFound');
        }
    } else {
        this.emit('notFound', { name: itemName });
    }
};

module.exports = ItemFinder;
