'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;

    app.mongoose.Promise = global.Promise;
    app.mongoose.set('useNewUrlParser', true);
    app.mongoose.set('useFindAndModify', false);
    app.mongoose.set('useCreateIndex', true);

    setTimeout(function () {
        app.beforeStart(async () => {
            const ctx = app.createAnonymousContext();
            // preload before app start

            ctx.service.quoteTask.startTask2();

            ctx.service.quoteTask.startTask();
        });
    }, 5000);

    router.get('/quote/coin/getAllCoinList/:pageNum/:pageSize', controller.home.getAllCoinList);

    router.get('/quote/coin/hot',controller.home.getAllHotCoinList);

    router.post('/quote/coin/getCoinListBySymbol',controller.home.getCoinListBySymbol);

};
