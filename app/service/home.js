const Service = require('egg').Service;

class HomeService extends Service {

    async getAllCoinList({startNum, pageSize, symbol}) {
        let {ctx} = this;
        let where = {};
        if (symbol) {
            let qs = new RegExp(symbol);
            where.symbol = qs;
        }
        let data = await ctx.model.Quote.find(where).skip(parseInt(startNum)).limit(parseInt(pageSize)).sort({cmc_rank: 1});
        return data;
    }

    async getAllCoinCount({pageNum, pageSize, symbol}) {
        let {ctx} = this;
        let where = {};
        if (symbol) {
            let qs = new RegExp(symbol);
            where.symbol = qs;
        }
        let data = await ctx.model.Quote.count(where);
        return data;
    }

    async findOneQuoteAvatar(conn) {
        try {
            let {ctx} = this;
            let obj = await ctx.model.QuoteAvatar.findOne(conn);
            return obj;
        } catch (e) {
            return {};
        }
    }

    async saveHotSearch(symbol) {
        let {ctx} = this;
        let obj = await ctx.model.HotSearch.findOne({symbol: symbol});
        if (obj) {
            let result = await ctx.model.HotSearch.updateOne({symbol: symbol}, {$inc: {count: 1}});
            return result;
        } else {
            let admin = new ctx.model.HotSearch({symbol: symbol, count: 1});
            let result = await admin.save();
            return result;
        }
    }

    async getAllHotCoinList() {
        let {ctx} = this;
        let data = await ctx.model.HotSearch.find({}, 'symbol count').sort({count: -1}).limit(20);
        return data;
    }

    async getCoinListBySymbol (symbols){
        let {ctx} = this;
        let data = await ctx.model.Quote.find({symbol:{$in:symbols}});
        return data;
    }

}


module.exports = HomeService;
