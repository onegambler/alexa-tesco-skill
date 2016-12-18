'use strict';

const AlexaSkill = require('./alexa-skill');
const IftttClient = require('./ifttt-client');
const itemRepository = require('./item-repository');

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
    const itemIdentifier = itemRepository.getItemIdentifier(intent.slots.item.value);
    let  message;
    if (itemIdentifier) {
        client.addItem(, function callback(error) {
            if (error) {
                message = 'Something went wrong';
            } else {
                const item = intent.slots.item;
                message = `I added ${intent.slots.item.value} to the basket`;
            }
        });
    } else {        
        message = 'Item ${intent.slots.item.value} was not found. Please set up a mapping'
    }
    response.tell(message);
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
