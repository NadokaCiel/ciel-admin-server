'use strict';

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

/** @type Egg.EggPlugin */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};
