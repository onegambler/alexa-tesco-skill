'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('request');

const expect = chai.expect;
const AlexaSkill = require('../lib/alexa-skill');

chai.use(sinonChai);

const ITEM_ID = 'id';
const URL = 'URL';

describe('Alexa Skill', () => {
    beforeEach(() => {
        this.post = sinon.stub(request, 'post');
    });

    afterEach(() => {
        this.post.restore();
    });

    it('should properly build the object', (done) => {
        const alexaSkill = new AlexaSkill('ID');
        expect(alexaSkill._appId).to.deep.equal('ID');
        done();
    });

    it('should contains all needed events handlers', (done) => {
        const alexaSkill = new AlexaSkill('ID');
        expect(alexaSkill.eventHandlers.onSessionStarted).to.be.not.undefined;
        expect(alexaSkill.eventHandlers.onIntent).to.be.not.undefined;
        expect(alexaSkill.eventHandlers.onLaunch).to.be.not.undefined;
        expect(alexaSkill.eventHandlers.onSessionEnded).to.be.not.undefined;
        done();
    });
});

