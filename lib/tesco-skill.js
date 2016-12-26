'use strict';

const request = require('request');

const AlexaSkill = require('./alexa-skill');
const IftttClient = require('./ifttt-client');
const ItemFinder = require('./util/item-finder');
const itemRepository = require('./repository/item-repository');
const messageBuilder = require('./util/message-builder');

const client = new IftttClient(process.env.TRIGGER_URL, request);

/**
 * App ID for the skill
 */
const APP_ID = process.env.APP_ID;

const TescoSkill = function TescoSkill() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TescoSkill.prototype = Object.create(AlexaSkill.prototype);
TescoSkill.prototype.constructor = TescoSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
TescoSkill.prototype.eventHandlers.onSessionStarted = function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId: ${sessionStartedRequest.requestId}
        , sessionId: ${session.sessionId}`);
    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
TescoSkill.prototype.eventHandlers.onLaunch = function onLaunch(launchRequest, session, response) {
    console.log(`TescoSkill onLaunch requestId: ${launchRequest.requestId}, sessionId: ${session.sessionId}`);
    const message = messageBuilder.buildWelcomeMessage();
    response.ask(message.speechOutput, message.repromptSpeech);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
TescoSkill.prototype.eventHandlers.onSessionEnded = function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId: ${sessionEndedRequest.requestId}
        , sessionId: ${session.sessionId}`);

    // Any session cleanup logic would go here.
};

function handleAddItemIntent(intent, session, response) {
    const itemFinder = new ItemFinder(itemRepository);
    itemFinder.on('found', function found(item) {
        client.addItemToBasket(item.id, item.quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item.value, item.quantity);
            response.tell(message);
        });
    });
    itemFinder.on('fuzzyFound', function fuzzyFound(fuzzyItem) {
        session.attributes.item = fuzzyItem.value;
        session.attributes.quantity = fuzzyItem.quantity;
        session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem.value);
        session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem.value);
        session.attributes.rootIntent = intent.name;
        response.ask(`Sorry I didn't quite get that. Did you mean ${fuzzyItem.value}?`);
    });
    itemFinder.on('notFound', function nothingFound(item) {
        response.tell(messageBuilder.buildNotFoundResponseMessage(item.value));
    });

    itemFinder.process(intent.slots);
}

function handleAddSomeItemIntent(intent, session, response) {
    const itemFinder = new ItemFinder();
    itemFinder.on('found', function found(item) {
        session.attributes.item = item.value;
        session.attributes.quantity = {};
        session.attributes.itemId = itemRepository.getItemIdentifier(item.value);
        session.attributes.rootIntent = intent.name;
        response.ask(`Ok, how many ${item.value} do you want to add?`);
    });
    itemFinder.on('fuzzyFound', function fuzzyFound(fuzzyItem) {
        session.attributes.item = fuzzyItem.value;
        session.attributes.quantity = fuzzyItem.quantity;
        session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem.value);
        session.attributes.rootIntent = intent.name;
        response.ask(`Sorry I didn't quite get that. Did you mean ${fuzzyItem.value}?`);
    });
    itemFinder.on('notFound', function nothingFound(item) {
        response.tell(messageBuilder.buildNotFoundResponseMessage(item.value));
    });
    itemFinder.process(intent.slots);
}

function handleQuantityNumberIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequestMessage());
        return;
    }

    const item = session.attributes.item;
    const itemId = session.attributes.itemId;
    const quantity = parseInt(intent.slots.quantity.value, 10);

    if (!isNaN(quantity)) {
        client.addItemToBasket(itemId, quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
            response.tell(message);
        });
    } else {
        response.ask('Sorry I didn\'t get it. Can you please repeat?');
    }
}

function handleYesIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequest());
        return;
    }
    const { item, itemId, quantity, rootIntent } = session.attributes;

    if (rootIntent === 'AddItem') {
        client.addItemToBasket(itemId, quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
            response.tell(message);
        });
    } else if (rootIntent === 'AddSomeItem') {
        response.ask(`Ok, how many ${item} do you want to add?`);
    } else {
        console.info(`Impossible to correctly process intent ${rootIntent}`);
        response.tell('Sorry, there was an error with the request');
    }
}

function handleNoIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequestMessage());
        return;
    }
    response.tell('Ok, no worries');
}

TescoSkill.prototype.intentHandlers = {
    AddItem(intent, session, response) {
        handleAddItemIntent(intent, session, response);
    },

    AddSomeItem(intent, session, response) {
        handleAddSomeItemIntent(intent, session, response);
    },

    QuantityNumber(intent, session, response) {
        handleQuantityNumberIntent(intent, session, response);
    },

    'AMAZON.HelpIntent': function HelpIntent(intent, session, response) {
        const speechText = 'I can help you adding groceries into the Tesco basket. ' +
            'Just say "Alexa ask Tesco to add milk to the basket" or simply "Alexa ask Tesco to add Milk.';

        const speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        const repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
    },

    'AMAZON.YesIntent': function YesIntent(intent, session, response) {
        handleYesIntent(intent, session, response);
    },

    'AMAZON.NoIntent': function NoIntent(intent, session, response) {
        handleNoIntent(intent, session, response);
    },

    'AMAZON.StopIntent': function StopIntent(intent, session, response) {
        const speechOutput = 'Goodbye';
        response.tell(speechOutput);
    },

    'AMAZON.CancelIntent': function CancelIntent(intent, session, response) {
        const speechOutput = 'Goodbye';
        response.tell(speechOutput);
    }
};

module.exports = TescoSkill;
