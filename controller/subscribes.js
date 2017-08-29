import Subscribe from '../models/Subscribe';
import User from '../models/User';
import Clinic from '../models/Clinic';

exports.postNewSubscribe = (user, subscribeFromFrontEnd,cb) => {

    const newSubscribe = new Subscribe({
      user: subscribeFromFrontEnd.user._id,
      clinic: subscribeFromFrontEnd.clinic._id
    })

    // saving new subscribe to database
    newSubscribe.save((err) => {
      if(err) {console.log(err); return;}
      cb(newSubscribe)
    })

    // adding new subscribe id to array in User collection
    User.findOne({'_id': subscribeFromFrontEnd.user._id}, (err, user) => {
      user.subscribe.push(newSubscribe._id);
      user.save((err) => {
        if(err) {console.log(err); return;}
      })
    })

    // adding new subscribe id to array in Clinic collection
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

  Subscribe.findOneAndRemove({'_id': data.subscribe_id}, (err, subscribe) => {

    // removing subscribe id from array in User collection
    User.findOneAndUpdate({'_id': data.user_id}, {
      '$pull': {'subscribe': data.subscribe_id }
    }, (err,user) => {
      if(err) {console.log(err); return;}
    })

    // removing subscribe id from array in Clinic collection
    Clinic.findOneAndUpdate({'_id': data.clinic_id}, {
      '$pull': {'subscribe': data.subscribe_id }
    }, (err,clinic) => {
      if(err) {console.log(err); return;}
    })

    // callback function to trigger socket.emit in routes
    cb(data)
  })
}
