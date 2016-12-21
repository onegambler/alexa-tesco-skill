'use strict';

const itemRepository = require('../repository/item-repository');
const fuzzy = require('../util/fuzzy-search');
const EventEmitter = require('events').EventEmitter;

const ItemUtil = module.exports = exports;


ItemUtil.getItemFromIntent = function getItemFromIntent(intent) {
    const quantity = intent.slots.quantity.value;
    const item = intent.slots.item.value;
    const itemId = itemRepository.getItemIdentifier(item);

    const eventEmitter = new EventEmitter();
    if (item && !itemId) {
        const fuzzyItem = fuzzy.findBestMatch(item);
        if (fuzzyItem) {
            const id = itemRepository.getItemIdentifier(fuzzyItem.value);
            eventEmitter.emit('fuzzyFound', { id, value: fuzzyItem, quantity });
        } else {
            eventEmitter.emit('notFound');
        }
    } else if (itemId) {
        eventEmitter.emit('found', { id: itemId, value: item, quantity });
    } else {
        eventEmitter.emit('notFound', { value: item });
    }
};
