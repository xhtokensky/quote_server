'use strict';

let Response = require('./../utils/resObj');
let code = require('./../utils/code');
const Controller = require('egg').Controller;

class HomeController extends Controller {
    async getAllCoinList() {
        const {ctx} = this;

        let response = Response();
        try {
            let pageNum = Number(this.ctx.params.pageNum) || 1;
            let pageSize = Number(this.ctx.params.pageSize) || 20;
            if (pageSize > 100) {
                pageSize = 100;
            }
            let startNum = (pageNum - 1) * pageSize;
            let symbol = this.ctx.query.symbol;
            if (symbol) {
                symbol = symbol.toUpperCase();
            }
            let params = {
                startNum: startNum,
                pageSize: pageSize,
                symbol: symbol
            };
            let data = await this.ctx.service.home.getAllCoinList(params);
            for (let i = 0; i < data.length; i++) {
                let quoteAvatar = await ctx.service.home.findOneQuoteAvatar({symbol: data[i].symbol});
                data[i]._doc.avatar = quoteAvatar ? `${quoteAvatar.avatar}` : '';
            }
            if (symbol && data.length > 0) {
                await this.ctx.service.home.saveHotSearch(data[0].symbol);
            }

            let count = await this.ctx.service.home.getAllCoinCount(params);


            response.content.data = data;
            response.content.currentPage = pageNum;
            response.content.totalPage = count;
            return ctx.body = response;
        } catch (e) {
            console.error(`getAllCoinList error:`, e.message);
            ctx.logger.error(`getAllCoinList error:`, e.message);
            response.errMsg('系统错误,' + e.message, code.ERROR_SYSTEM, 'ERROR_SYSTEM');
            return this.ctx.body = response;
        }
    }

    async getAllHotCoinList() {
        const {ctx} = this;
        let response = Response();
        try {
            let data = await ctx.service.home.getAllHotCoinList();
            response.content.data = data;
            return ctx.body = response;
        } catch (e) {
            console.error(`getAllHotCoinList error:`, e.message);
            ctx.logger.error(`getAllHotCoinList error:`, e.message);
            response.errMsg('系统错误,' + e.message, code.ERROR_SYSTEM, 'ERROR_SYSTEM');
            return this.ctx.body = response;
        }
    }

    async getCoinListBySymbol() {
        const {ctx} = this;
        let response = Response();
        try {
            let body = this.ctx.request.body;
            let symbol = body.symbol;
            if (!symbol) {
                response.content.data = [];
                return ctx.body = response;
            }
            let symbols = symbol.split(',');
            let data = await ctx.service.home.getCoinListBySymbol(symbols);
            if (data && Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    let quoteAvatar = await ctx.service.home.findOneQuoteAvatar({symbol: data[i].symbol});
                    data[i]._doc.avatar = quoteAvatar ? `${quoteAvatar.avatar}` : '';
                }
            }
            response.content.data = data;
            return this.ctx.body = response;
        } catch (e) {
            console.error(`like error:`, e.message);
            ctx.logger.error(`like error:`, e.message);
            response.errMsg('系统错误,' + e.message, code.ERROR_SYSTEM, 'ERROR_SYSTEM');
            return this.ctx.body = response;
        }
    }


}

module.exports = HomeController;
