module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const schema = new Schema({
        symbol: {type: String},
        count: {type: Number}
    });
    schema.index({symbol: 1,}, {unique: false});
    return mongoose.model('HotSearch', schema, 'hotSearch');  //返回model
};
