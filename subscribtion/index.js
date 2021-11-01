const { SubscribtionModel } = require('../db/index');

const User = require('../Users/index');

const user = new User();
class Subscribtion {
    constructor() {}
    async create(source, target) {
        const findTarget = await user.find({_id: target });
        if(!findTarget) {
            throw new Error('Target not found!')
        }
        console.log(findTarget, source, target);
        const result = await SubscribtionModel.create({source, target, state: 'pending'});
        return result;
    }
    async getPendingSubscribtions(id) {
        const currentUser = await user.find({_id: id});
        if(!currentUser) {
            throw new Error('User not found!');
        }
        const subscribtions = await SubscribtionModel.find({target: id, state: 'pending'}).exec();
        return subscribtions;
    }
    
    async acceptPendingSubscription(userId, subscribtionId) {
        const currentUser = await user.find({ _id: userId });
        if(!currentUser) {
            throw new Error('User not found!')
        }
        const subscribtion = await SubscribtionModel.updateOne({
            _id: subscribtionId,
            target: userId,
            state: 'pending'}, { $set: {state: 'accepted'} });

            return subscribtion;
    
    }
    async rejectPendingSubscribtion(userId, subscribtionId) {
        const currentUser = await user.find( { _id: userId});
        if(!currentUser) {
            throw new Error('User not found!')
        }
        const subscribtion = await SubscribtionModel.deleteOne( {
            _id: subscribtionId,
            target: userId,
            state: 'pending' });
            return subscribtions;
    }
}
module.exports = Subscribtion;