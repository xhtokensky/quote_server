const rp = require('request-promise');
const Service = require('egg').Service;

class QuoteTaskService extends Service {


    async sleep(t) {
        let st = 1000 * 5;
        if (t) {
            st = t;
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('ok');
            }, st);
        })
    }

    async startTask() {
        let {ctx} = this;
        while (true) {

            try {
                await this.sleep();
                const requestOptions = {
                    method: 'GET',
                    uri: this.app.config.quoteConfig.cryptocurrency.uri,
                    qs: {
                        'start': this.app.config.quoteConfig.cryptocurrency.start,
                        'limit': this.app.config.quoteConfig.cryptocurrency.limit
                    },
                    headers: {
                        'X-CMC_PRO_API_KEY': this.app.config.quoteConfig.cryptocurrency.API_KEY
                    },
                    json: true,
                    gzip: true
                };

                let body = await rp(requestOptions);

                let data = body.data;
                for (let i = 0; i < data.length; i++) {
                    data[i].base_category = 'cryptocurrency';
                    let quoteObject = await ctx.model.Quote.findOne({id: data[i].id});
                    if (!quoteObject) {
                        let admin = new ctx.model.Quote(data[i]);
                        await admin.save();
                    } else {

                        await ctx.model.Quote.updateOne({id: data[i].id}, data[i]);
                    }
                    //await this.sleep(1000);
                    if (i == data.length - 1) {
                        await this.sleep(1000 * 10);
                    }
                }
            } catch (e) {
                console.error(`startTask error:`, e);
                this.ctx.logger.error(`startTask error:`, e);
            }
        }
    }

    async postQuoteAvatar() {
        let list = [];
        let max = this.app.config.quoteConfig.mifengchaavatar.max;
        let size = this.app.config.quoteConfig.mifengchaavatar.size;
        let API_KEY = this.app.config.quoteConfig.mifengchaavatar.API_KEY;
        let url = this.app.config.quoteConfig.mifengchaavatar.url;
        const requestOptions = {
            method: 'GET',
            uri: url,
            qs: {
                'page': 0,
                'size': size
            },
            headers: {
                'BLOCK_CC_API_KEY': API_KEY
            },
            json: true,
            gzip: true
        };
        for (let i = 0; i < max; i++) {
            try {
                console.log(`正在抓取行情icon第${i + 1}页`);
                requestOptions.qs.page = i;
                let body = await rp(requestOptions);
                if (body.code == 0) {
                    let data = body.data.list;
                    for (let j = 0; j < data.length; j++) {
                        let symbol = data[j].symbol;
                        let imgUrl = data[j].imgUrl;
                        list.push({
                            symbol: symbol,
                            imgUrl: imgUrl
                        })
                    }
                }
                await this.sleep(500);
                console.log(`第${i + 1}页抓取完毕`);
                if (i == max - 1) {
                    return list;
                }
            } catch (e) {
                if (i == max - 1) {
                    return list;
                }
                console.log('异常', e);
            }
        }
    }

    async startTask2() {
        let fs = require('fs');
        try {
            let quoteAvatar = fs.readFileSync('./quoteAvatar.json');
            quoteAvatar = JSON.parse(quoteAvatar.toString());
            if (quoteAvatar && quoteAvatar.quoteAvatars) {
                let quoteAvatars = quoteAvatar.quoteAvatars;
                this.saveQuoteAvatar(quoteAvatars);
            } else {
                let list = await this.postQuoteAvatar();
                fs.writeFile('./quoteAvatar.json', JSON.stringify({quoteAvatars: list}), function (err) {
                    if (err) {
                        console.log(`writeFile erro :`, err.message)
                    } else {
                        let quoteAvatar = fs.readFileSync('./quoteAvatar.json');
                        quoteAvatar = JSON.parse(quoteAvatar.toString());
                        if (quoteAvatar) {
                            let quoteAvatars = quoteAvatar.quoteAvatars;
                            this.saveQuoteAvatar(quoteAvatars);
                        }
                    }
                });
            }
        } catch (e) {
            let list = await this.postQuoteAvatar();
            fs.writeFile('./quoteAvatar.json', JSON.stringify({quoteAvatars: list}), function (err) {
                if (err) {
                    console.log(`writeFile erro :`, err.message)
                } else {
                    let quoteAvatar = fs.readFileSync('./quoteAvatar.json');
                    quoteAvatar = JSON.parse(quoteAvatar.toString());
                    if (quoteAvatar) {
                        let quoteAvatars = quoteAvatar.quoteAvatars;
                        this.saveQuoteAvatar(quoteAvatars);
                    }
                }
            });
        }

    }

    async saveQuoteAvatar(data) {

        let {ctx} = this;
        let quoteAvatars = await ctx.model.QuoteAvatar.find();
        if (!quoteAvatars || quoteAvatars.length == 0) {
            for (let j = 0; j < data.length; j++) {
                try {
                    let symbol = data[j].symbol;
                    let imgUrl = data[j].imgUrl;

                    let base64Img = await this.app.convertImageToBase64(imgUrl);

                    await this.sleep(20);

                    let params = {
                        symbol: symbol,
                        avatar: base64Img,
                        avatarUrl: imgUrl
                    };
                    console.log(`正在插入第${j + 1}条行情icon数据`);
                    let admin = new ctx.model.QuoteAvatar(params);
                    await admin.save();
                    if (j == data.length - 1) {
                        console.log(`插入完毕`);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        } else {
            console.log('已抓取行情icon');
        }
    }


}

module.exports = QuoteTaskService;
