'use strict';

const AlexaSkill = require('./alexa-skill');
const IftttClient = require('./ifttt-client');
const itemRepository = require('./item-repository');
const messageBuilder = require('./util/message-builder');
const async = require('async');

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

/**
 * Handles AddItem itent by adding item to the Tesco shopping list
 */
function handleAddItemIntent(intent, session, response) {
    const quantity = intent.slots.quantity.value;
    const item = intent.slots.item.value;
    const itemIdentifier = itemRepository.getItemIdentifier(item);
    if (itemIdentifier) {
        async.times(quantity || 1, function asyncFunction(n, next) {
            client.addItemToBasket(itemIdentifier, function callback(error) {
                next(error);
            });
        }, function globalCallback(error) {
            const message = messageBuilder.buildAddItemResponseMessage(error, item, quantity);
            response.tell(message);
        });
    } else {
        response.tell(messageBuilder.buildNotFoundResponseMessage(item));
    }
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

    'AMAZON.StopIntent': (intent, session, response) => {
        const speechOutput = 'Goodbye';
        response.tell(speechOutput);
    },

    'AMAZON.CancelIntent': (intent, session, response) => {
        const speechOutput = 'Goodbye';
        response.tell(speechOutput);
    }
};

module.exports = TescoSkill;