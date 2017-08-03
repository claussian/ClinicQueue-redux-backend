import Subscribe from '../models/Subscribe';
import User from '../models/User';
import Clinic from '../models/Clinic';

exports.postNewSubscribe = (user, subscribeFromFrontEnd,cb) => {
  console.log("subscribe controller reached")
  console.log(subscribeFromFrontEnd)
  console.log(user)
  //if(user._id){
    const newSubscribe = new Subscribe({
      user: subscribeFromFrontEnd.user._id,
      clinic: subscribeFromFrontEnd.clinic._id
    });

    newSubscribe.save((err) => {
      if(err) {console.log(err); return;}
      cb(newSubscribe)
    })

    User.findOne({'_id': subscribeFromFrontEnd.user._id}, (err, user) => {
      user.subscribe.push(newSubscribe._id);
      user.save((err) => {
        if(err) {console.log(err); return;}
      })
    })

    Clinic.findOne({'_id': subscribeFromFrontEnd.clinic._id}, (err, clinic) => {
      clinic.subscribe.push(newSubscribe._id);
      clinic.save((err) => {
        if(err) {console.log(err); return;}
      })
    })
  }

/*
possible suggestion of subscribeInfo
{
subscribe_id:
user_id:
clinic_id:
}
*/

exports.deleteSubscribe = (user, data, cb) => {
  console.log('delete subscribe Controller reached')
  Subscribe.findOneAndRemove({'_id': data.subscribe_id}, (err, subscribe) => {

    User.findOneAndUpdate({'_id': data.user_id}, {
      '$pull': {'subscribe': data.subscribe_id }
    }, (err,user) => {
      if(err) {console.log(err); return;}
    })

    Clinic.findOneAndUpdate({'_id': data.clinic_id}, {
      '$pull': {'subscribe': data.subscribe_id }
    }, (err,clinic) => {
      if(err) {console.log(err); return;}
    })

    cb(data)
  })
}
