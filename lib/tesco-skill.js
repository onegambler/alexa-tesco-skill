'use strict';

const request = require('request');

const AlexaSkill = require('./alexa-skill');
const IftttClient = require('./ifttt-client');
const ItemFinder = require('./util/item-finder');
const itemRepository = require('./repository/item-repository');
const messageBuilder = require('./util/message-builder');

const client = new IftttClient(process.env.IFTTT_URL, process.env.IFTTT_KEY, request);

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
    console.log(`onSessionEnded requestId: ${sessionEndedRequest.requestId}, sessionId: ${session.sessionId}`);

    // Any session cleanup logic would go here.
};

function handleAddItemIntent(intent, session, response) {
    const itemFinder = new ItemFinder(itemRepository);
    itemFinder.on('found', function found(item) {
        client.addItemToBasket(item, item.quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item.name, item.quantity);
            response.tell(message);
        });
    });
    itemFinder.on('fuzzyFound', function fuzzyFound(itemCapturedName, fuzzyItem) {
        session.attributes.itemName = fuzzyItem.name;
        session.attributes.itemCapturedName = itemCapturedName;
        session.attributes.quantity = fuzzyItem.quantity;
        session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem.name);
        session.attributes.rootIntent = intent.name;
        response.ask(`Sorry I didn't quite get that. Did you mean ${fuzzyItem.name}?`);
    });
    itemFinder.on('notFound', function nothingFound(item) {
        response.tell(messageBuilder.buildNotFoundResponseMessage(item.name));
    });

    itemFinder.process(intent.slots);
}

function handleAddSomeItemIntent(intent, session, response) {
    const itemFinder = new ItemFinder();
    itemFinder.on('found', function found(item) {
        session.attributes.itemName = item.name;
        session.attributes.quantity = {};
        session.attributes.itemId = itemRepository.getItemIdentifier(item.name);
        session.attributes.rootIntent = intent.name;
        response.ask(`Ok, how many ${item.name} do you want to add?`);
    });
    itemFinder.on('fuzzyFound', function fuzzyFound(itemCapturedName, fuzzyItem) {
        session.attributes.itemName = fuzzyItem.name;
        session.attributes.quantity = fuzzyItem.quantity;
        session.attributes.itemCapturedName = itemCapturedName;
        session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem.name);
        session.attributes.rootIntent = intent.name;
        response.ask(`Sorry I didn't quite get that. Did you mean ${fuzzyItem.name}?`);
    });
    itemFinder.on('notFound', function nothingFound(item) {
        response.tell(messageBuilder.buildNotFoundResponseMessage(item.name));
    });
    itemFinder.process(intent.slots);
}

function handleQuantityNumberIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequestMessage());
        return;
    }

    const item = {
        name: session.attributes.item,
        id: session.attributes.itemId
    };

    const quantity = Number(intent.slots.quantity.value);

    if (!isNaN(quantity)) {
        client.addItemToBasket(item, quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item.name, quantity);
            response.tell(message);
        });
    } else {
        response.ask('Sorry I didn\'t get it. Can you please repeat?');
    }
}

function handleYesIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequestMessage());
        return;
    }

    const item = {
        name: session.attributes.item,
        id: session.attributes.itemId
    };
    const quantity = session.attributes.quantity;
    const rootIntent = session.attributes.rootIntent;

    if (rootIntent === 'AddItem') {
        client.addItemToBasket(item, quantity, function callback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item.name, quantity);
            response.tell(message);
        });
    } else if (rootIntent === 'AddSomeItem') {
        response.ask(`Ok, how many ${item} do you want to add?`);
    } else {
        console.info(`Failed to correctly process intent ${rootIntent}`);
        response.tell('Sorry, there was an error with the request');
    }
}

function handleNoIntent(intent, session, response) {
    if (session.new) {
        response.tell(messageBuilder.buildWrongRequestMessage());
        return;
    }

    if (session.attributes.finalStep) {
        response.tell('Ok, no worries');
        return;
    }

    const itemName = session.attributes.itemCapturedName;
    session.attributes.itemName = itemName;
    session.attributes.itemId = null;
    session.attributes.finalStep = true;

    const quantity = session.attributes.quantity;
    response.ask(messageBuilder.buildTryAnywayQuestion(itemName, quantity));
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
        const responseMessage = messageBuilder.buildHelpResponseMessage();
        response.ask(responseMessage.speechOutput, responseMessage.repromptOutput);
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
