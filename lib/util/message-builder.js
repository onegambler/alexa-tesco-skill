'use strict';

const MessageBuilder = module.exports = exports;

MessageBuilder.buildAddItemResponseMessage =
    function buildAddItemResponseMessage(error, itemName, quantity) {
        const message = [];
        if (error) {
            message.push('Something went wrong');
        } else {
            message.push('I added');
            if (quantity) {
                message.push(`${quantity}`);
            }
            message.push(`${itemName} to the basket`);
        }

        return message.join(' ');
    };

MessageBuilder.buildNotFoundResponseMessage = function buildNotFoundResponseMessage(itemName) {
    return `Item ${itemName} was not found. Please set up a mapping`;
};

MessageBuilder.buildWelcomeMessage = function buildWelcomeMessage() {
    return {
        speechOutput: 'Welcome to Tesco. You can manage your Tesco basket by adding items. What would you like to do?',
        repromptSpeech: 'What would you like to do?'
    };
};

MessageBuilder.buildWrongRequestMessage = function buildWrongRequestMessage() {
    return 'I am not sure what you mean by that';
};

MessageBuilder.buildHelpResponseMessage = function buildHelpMessage() {
    return {
        speechOutput: 'I can help you adding groceries into the Tesco basket. Just say "Alexa ask Tesco to add milk to the basket" or simply "Alexa ask Tesco to add Milk. What can I do for you?',
        repromptSpeech: 'What can I do for you?'
    };
};

MessageBuilder.buildTryAnywayQuestion = function buildTryAnywayQuestionM(itemName, quantity) {
    const message = ['I didn\'t recognise the product. Do you still want me to add'];
    if (quantity) {
        message.push(`${quantity}`);
    }
    message.push(`${itemName} to the basket?`);

    return message.join(' ');
};
