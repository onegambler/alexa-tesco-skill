'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('request');

const expect = chai.expect;
const lambdaContext = require('./fixtures/lambda_context_mock.js');
const AlexaSkill = require('../lib/alexa-skill');

const { ALEXA_INTENT,
    ALEXA_START_SESSION,
    ALEXA_END_SESSION } = require('./fixtures/test-requests');

chai.use(sinonChai);

const SKILL_ID = 'amzn1.echo-sdk-ams.app.12345';
const URL = 'URL';

describe('Initializing the abstract AlexaSkill class', () => {
    let alexaSkill;
    beforeEach(() => {
        this.post = sinon.stub(request, 'post');
        alexaSkill = new AlexaSkill(SKILL_ID);
    });

    afterEach(() => {
        this.post.restore();
    });

    it('should properly build the object', (done) => {
        expect(alexaSkill._appId).to.deep.equal(SKILL_ID);
        done();
    });

    it('should contains all needed events handlers', (done) => {
        expect(alexaSkill.eventHandlers).to.include.keys(
            'onSessionStarted', 'onIntent', 'onLaunch', 'onSessionEnded');
        done();
    });

    it('should call the session started handler when the session is new', () => {
        const sessionStartedSpy = sinon.spy(alexaSkill.eventHandlers, 'onSessionStarted');
        alexaSkill.execute(ALEXA_START_SESSION, lambdaContext);
        expect(sessionStartedSpy).to.have.been.calledOnce.calledWith(
            ALEXA_START_SESSION.request, ALEXA_START_SESSION.session);
        sessionStartedSpy.restore();
    });

    it('should not call the session started handler when the session exists', () => {
        const sessionStartedSpy = sinon.spy(alexaSkill.eventHandlers, 'onSessionStarted');
        alexaSkill.execute(ALEXA_END_SESSION, lambdaContext);
        expect(sessionStartedSpy).to.have.not.been.called;
        sessionStartedSpy.restore();
    });

    it('should dynamically calls the correct handlers for a SessionEnded request', () => {
        const sessionEndSpy = sinon.spy(alexaSkill.eventHandlers, 'onSessionEnded');
        alexaSkill.execute(ALEXA_END_SESSION, lambdaContext);
        expect(sessionEndSpy).to.have.been.calledOnce.calledWith(
            ALEXA_END_SESSION.request, ALEXA_END_SESSION.session);
        sessionEndSpy.restore();
    });

    it('should throw exception for onLaunch request', () => {
        const onLaunchSpy = sinon.spy(alexaSkill.eventHandlers, 'onLaunch');
        alexaSkill.execute(ALEXA_INTENT, lambdaContext);
        expect(onLaunchSpy).to.have.not.been.called;
        onLaunchSpy.restore();
    });

    it('should correctly handle passed intent if handler exists', () => {
        const intentHandlerStub = sinon.stub(alexaSkill.eventHandlers, 'onIntent');
        alexaSkill.intentHandlers['TestIntent'] = intentHandlerStub;
        alexaSkill.execute(ALEXA_INTENT, lambdaContext);
        expect(intentHandlerStub).to.have.been.calledOnce;
        intentHandlerStub.restore();
    });
});

describe('Handling failures in the AlexaSkill class', () => {

    let context;

    beforeEach(() => {
        context = sinon.mock(lambdaContext);
    });

    afterEach(() => {
        context.restore();
    });

    it('should properly handle an application ID mismatch error', () => {
        const alexaSkill = new AlexaSkill('amzn1.echo-sdk-ams.app.wrong');
        context.expects('fail').once();
        alexaSkill.execute(ALEXA_START_SESSION, lambdaContext);
        context.verify();
    });

    it('should properly handle an intent handler not found error', () => {
        const alexaSkill = new AlexaSkill(SKILL_ID);
        context.expects('fail').once();
        alexaSkill.intentHandlers = {};
        alexaSkill.execute(ALEXA_INTENT, lambdaContext);
        context.verify();
    });

    it('should properly handle an onLaunchEvent not found error', () => {
        const alexaSkill = new AlexaSkill(SKILL_ID);
        context.expects('fail').once();
        alexaSkill.execute(ALEXA_START_SESSION, lambdaContext);
        context.verify();
    });
});

