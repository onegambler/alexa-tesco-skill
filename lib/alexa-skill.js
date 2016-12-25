'use strict';

function AlexaSkill(appId) {
    this._appId = appId;
}

AlexaSkill.speechOutputType = {
    PLAIN_TEXT: 'PlainText',
    SSML: 'SSML'
};

/**
 * Subclasses should override the intentHandlers with the functions to handle specific intents.
 */
AlexaSkill.prototype.intentHandlers = {};

/**
 * Override any of the eventHandlers as needed
 */
AlexaSkill.prototype.eventHandlers = {
    /**
     * Called when the session starts.
     * Subclasses could have overriden this function to open any necessary resources.
     */
    onSessionStarted(sessionStartedRequest, session) {
    },

    /**
     * Called when the user invokes the skill without specifying what they want.
     * The subclass must override this function and provide feedback to the user.
     */
    onLaunch(launchRequest, session, response) {
        throw new Error('onLaunch should be overriden by subclass');
    },

    /**
     * Called when the user specifies an intent.
     */
    onIntent(intentRequest, session, response) {
        const intent = intentRequest.intent;
        const intentHandler = this.intentHandlers[intent.name];
        if (intentHandler) {
            console.log(`dispatch intent = ${intent.name}`);
            intentHandler.call(this, intent, session, response);
        } else {
            throw new Error(`Unsupported intent = ${intent.name}`);
        }
    },

    /**
     * Called when the user ends the session.
     * Subclasses could have overriden this function to close any open resources.
     */
    onSessionEnded(sessionEndedRequest, session) {
    }
};

AlexaSkill.prototype.requestHandlers = {
    LaunchRequest(event, context, response) {
        this.eventHandlers.onLaunch.call(this, event.request, event.session, response);
    },

    IntentRequest(event, context, response) {
        this.eventHandlers.onIntent.call(this, event.request, event.session, response);
    },

    SessionEndedRequest(event, context) {
        this.eventHandlers.onSessionEnded(event.request, event.session);
        context.succeed();
    }
};

const Response = function (context, session) {
    this._context = context;
    this._session = session;
};

AlexaSkill.prototype.execute = function execute(event, context) {
    try {
        // Validate that this request originated from authorized source.
        const applicationId = event.session.application.applicationId;
        if (this._appId && applicationId !== this._appId) {
            console.error(`The applicationIds don't match : ${applicationId} and ${this._appId}`);
            throw new Error('Invalid applicationId');
        }

        if (!event.session.attributes) {
            event.session.attributes = {};
        }

        if (event.session.new) {
            this.eventHandlers.onSessionStarted(event.request, event.session);
        }

        // Route the request to the proper handler which may have been overriden.
        const requestHandler = this.requestHandlers[event.request.type];
        return requestHandler.call(this, event, context, new Response(context, event.session));
    } catch (e) {
        console.log(`Unexpected exception ${e}`);
        return context.fail(e);
    }
};

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam.speech
        };
    }
    return {
        type: optionsParam.type || 'PlainText',
        text: optionsParam.speech || optionsParam
    };
}

Response.prototype = (function construct() {
    const buildSpeechletResponse = function buildSpeechletResponse(options) {
        const alexaResponse = {
            outputSpeech: createSpeechObject(options.output),
            shouldEndSession: options.shouldEndSession
        };
        if (options.reprompt) {
            alexaResponse.reprompt = {
                outputSpeech: createSpeechObject(options.reprompt)
            };
        }
        if (options.cardTitle && options.cardContent) {
            alexaResponse.card = {
                type: 'Simple',
                title: options.cardTitle,
                content: options.cardContent
            };
        }
        const returnResult = {
            version: '1.0',
            response: alexaResponse
        };
        if (options.session && options.session.attributes) {
            returnResult.sessionAttributes = options.session.attributes;
        }
        return returnResult;
    };

    return {
        tell(speechOutput) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                shouldEndSession: true
            }));
        },
        tellWithCard(speechOutput, cardTitle, cardContent) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                cardTitle,
                cardContent,
                shouldEndSession: true
            }));
        },
        ask(speechOutput, repromptSpeech) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                reprompt: repromptSpeech,
                shouldEndSession: false
            }));
        },
        askWithCard(speechOutput, repromptSpeech, cardTitle, cardContent) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                reprompt: repromptSpeech,
                cardTitle,
                cardContent,
                shouldEndSession: false
            }));
        }
    };
}());

module.exports = AlexaSkill;
