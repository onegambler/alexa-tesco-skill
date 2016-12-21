'use strict';

const itemRepository = require('../repository/item-repository');
const fuzzy = require('../util/fuzzy-search');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const ItemFinder = function ItemProcessor() {};

util.inherits(ItemFinder, EventEmitter);

ItemFinder.prototype.process = function process(intent) {
    const quantity = intent.slots.quantity ? intent.slots.quantity.value : null;
    const item = intent.slots.item.value;
    const itemId = itemRepository.getItemIdentifier(item);

    if (item && !itemId) {
        const fuzzyItem = fuzzy.findBestMatch(item);
        if (fuzzyItem) {
            const id = itemRepository.getItemIdentifier(fuzzyItem.value);
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
