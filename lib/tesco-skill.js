'use strict';

const AlexaSkill = require('./alexa-skill');
const IftttClient = require('./ifttt-client');
const itemRepository = require('./repository/item-repository');
const messageBuilder = require('./util/message-builder');
const async = require('async');
const fuzzy = require('./util/fuzzy-search');

const client = new IftttClient(process.env.TRIGGER_URL);

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
TescoSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId: ${sessionStartedRequest.requestId}
        , sessionId: ${session.sessionId}`);
    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
TescoSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log(`TescoSkill onLaunch requestId: ${launchRequest.requestId}, sessionId: ${session.sessionId}`);

    // TODO: add logic e.g. handleTellMeAJokeIntent(session, response);
    response.tell('This is a test');
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
TescoSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId: ${sessionEndedRequest.requestId}
        , sessionId: ${session.sessionId}`);

    // Any session cleanup logic would go here.
};

function handleAddItemIntent(intent, session, response) {
    const quantity = intent.slots.quantity.value;
    const item = intent.slots.item.value;
    const itemIdentifier = itemRepository.getItemIdentifier(item);

    if (!itemIdentifier) {
        const fuzzyItem = fuzzy.findBestMatch(item);
        if (fuzzyItem) {
            session.attributes.item = fuzzyItem;
            session.attributes.quantity = quantity;
            session.attributes.itemId = itemRepository.getItemIdentifier(fuzzyItem);
            return response.ask(`Sorry I didn't quite get that. Do you mean ${fuzzyItem}`);
        }
    }
    if (itemIdentifier) {
        async.times(quantity || 1, function asyncFunction(n, next) {
            client.addItemToBasket(itemIdentifier, function callback(error) {
                next(error);
            });
        }, function globalCallback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
            return response.tell(message);
        });
    }

    return response.tell(messageBuilder.buildNotFoundResponseMessage(item));
}

function handleYesIntent(intent, session, response) {
    if (session.new) {
        response.tell('I am not sure what you mean by that');
    }
    const item = session.attributes.item;
    const itemId = session.attributes.itemId;
    const quantity = session.attributes.quantity;

    async.times(quantity || 1, function asyncFunction(n, next) {
        client.addItemToBasket(itemId, function callback(error) {
            next(error);
        });
    }, function globalCallback(error) {
        const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
        return response.tell(message);
    });
}

TescoSkill.prototype.intentHandlers = {
    AddItem(intent, session, response) {
        handleAddItemIntent(intent, session, response);
    },

    'AMAZON.HelpIntent': function HelpIntent(intent, session, response) {
        const speechText = 'I can help you';

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
        console.info(`Intent ${JSON.stringify(intent)}`);
        console.info(`Session ${JSON.stringify(session)}`);
        return response.tell(`So you like ${session.attributes.item}, init?`);
    },

    'AMAZON.NoIntent': function NoIntent(intent, session, response) {
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
