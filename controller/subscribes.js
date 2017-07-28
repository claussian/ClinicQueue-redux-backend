import Subscribe from '../models/Subscribe';
import User from '../models/User';
import Clinic from '../models/Clinic';

exports.postNewSubscribe = (subscribeFromFrontEnd,cb) => {
  const newSubscribe = new Subscribe({
    user: subscribeFromFrontEnd.user._id,
    clinic: subscribeFromFrontEnd.clinic._id
  })

  newSubscribe.save((err) => {
    if(err) {console.log(err); return;}
    cb(newSubscribe)
  })

  User.findOne({'_id': subscribeFromFrontEnd.user._id}, (err, user) => {
    //to ask boss what to save inside subscribe for user and clinics
    user.subscribe.push(subscribeFromFrontEnd.clinic._id);
    user.save((err) => {
      if(err) {console.log(err); return;}
    })
  })

  Clinic.findOne({'_id': subscribeFromFrontEnd.clinic._id}, (err, clinic) => {
    clinic.subscribe.push(subscribeFromFrontEnd.user._id);
    clinic.save((err) => {
      if(err) {console.log(err); return;}
    })
  })
}
