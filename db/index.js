const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/basic', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;
const userSchema = new Schema( {
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    subscriber: Number,
});

const subscribtionSchema = {
    source: mongoose.SchemaTypes.ObjectId,
    target: mongoose.SchemaTypes.ObjectId,
    state: String,
    date: {
        type: Date,
        default: new Date(),
    },
}
const UserModel = mongoose.model('users', userSchema);
const SubscribtionModel = mongoose.model('subscribtions', subscribtionSchema)

module.exports = {
    UserModel,
    SubscribtionModel,
}