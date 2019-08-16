module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const schema = new Schema({
        symbol: {type: String},
        avatar: {},
        avatarUrl: {type: String}
    });
    schema.index({symbol: 1,}, {unique: false});
    return mongoose.model('QuoteAvatar', schema, 'quoteAvatar');  //返回model
};
