'use strict';

const MessageBuilder = module.exports = exports;

MessageBuilder.buildOk = function buildResponse(item, quantity) {
    let message = 'I added';
    if (quantity) {
        message += ` ${quantity}`;
    }
    message += ` ${item} to the basket`;
    return message;
};

MessageBuilder.buildNotFound = function buildResponse(item) {
    return `Item ${item} was not found. Please set up a mapping`;
};
