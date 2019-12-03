/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  console.log(appInfo);

  const config = exports = {};

  config.weiboAuth = '2.00FRgdwFyVTjzC633125e267DX57DD';
  config.weiboId = '7346261441';
  
  return {
    ...config,
  };
};