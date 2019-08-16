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
    config.keys = appInfo.name + '_1558666255058_4610';

    // add your middleware config here
    config.middleware = [];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    exports.security = {
        csrf: false
    };

    config.quoteConfig = {
        cryptocurrency:{
            start:1,
            limit:5000,
            uri:'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            API_KEY:'6c45d78b-10d3-4403-81a7-c129e466ccc8'
        },
        mifengchaavatar:{
            url:'https://mifengcha.com/api/new/v1/coin/list',
            max:81,
            size:60,
            API_KEY:'c98f6af21b15f2d445bb567383f7935a'
        }
    };

    config.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1/tokenskyQuoteDB',
            options: {},
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
