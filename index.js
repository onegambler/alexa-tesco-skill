'use strict';

/**
 * The TescoSkill prototype and helper functions
 */

const TescoSkill = require('./lib/tesco-skill');

const skill = new TescoSkill();

exports.handler = (event, context) => {
    skill.execute(event, context);
};
