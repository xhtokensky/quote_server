// this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性

module.exports = {


    convertImageToBase64(url) {

        let http = require('http');
        return new Promise(function (resolve, reject) {
            if (!url) {
                reject(null);
            }
            let urlheader = url.split(':')[0];
            if (urlheader == 'http') {
                http = require('http');
            }
            if (urlheader == 'https') {
                http = require('https');
            }
            try {
                http.get(url, function (res) {
                    let chunks = [];
                    let size = 0;
                    res.on('data', function (chunk) {
                        chunks.push(chunk);
                        size += chunk.length;　　//累加缓冲数据的长度
                    });
                    res.on('end', function (err) {
                        let data = Buffer.concat(chunks, size);
                        let base64Img = data.toString('base64');
                        resolve(base64Img);
                    });
                });
            } catch (e) {
                console.error(`convertImageToBase64 error : ${e.message}`);
                reject(null)
            }
        });
    }
};
