'use strict';

const TescoSkill = require('./lib/tesco-skill');

const skill = new TescoSkill();

exports.handler = function (event, context) {
    skill.execute(event, context);
};
