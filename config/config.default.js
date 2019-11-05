/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_nadoka';

  // add your middleware config here
  config.middleware = [];

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/ciel',
    options: {}
  }

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: '0',
    },
    agent: true,
  }

  config.security = {
    csrf: {
      enable: false, // 暂时禁用掉 csrf，错误信息：403 missing csrf token
    },
    domainWhiteList: [ '*' ]
  }

  config.cors = {
    origin: ['http://localhost:8080'],
    credentials: true,
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
