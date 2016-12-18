'use strict';

const MessageBuilder = module.exports = exports;

MessageBuilder.buildAddItemResponseMessage =
    function buildAddItemResponseMessage(error, item, quantity) {
        let message;
        if (error) {
            message = 'Something went wrong';
        } else {
            message = 'I added';
            if (quantity) {
                message += ` ${quantity}`;
            }
            message += ` ${item} to the basket`;
        }
        return message;
    };

MessageBuilder.buildNotFoundResponseMessage = function buildResponse(item) {
    return `Item ${item} was not found. Please set up a mapping`;
};
