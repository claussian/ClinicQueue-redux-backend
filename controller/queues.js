import Queue from '../models/Queue';
import Clinic from '../models/Clinic';
import User from '../models/User';
import Subscribe from '../models/Subscribe';
import cloudinary from 'cloudinary';
import fs from 'fs';
import {twilio} from '../app';

// Controller accepts callback 'cb' as an argument
// Cb will only exceute on completion of async database operation 'Queue.find()'
exports.getAllQueue = (cb) => {
  Queue.find({}).populate('clinic').populate('user').exec( (err, queues) => {
    // modifying the queue json object so that sensitive info of user is not exposed
    queues.forEach((queue,index,array) => {
      let newUser = {}
      newUser._id = queue.user._id;
      newUser.username = queue.user.username;
      newUser.role = queue.user.role;
      newUser.myClinic = queue.user.myClinic;
      queue.user = newUser;
      array[index] = queue;
    })
    cb(queues);
  })
}

exports.getQueue = (req, res) => {

  const id = req.params.id;
  Queue.findById(id)
    .populate('user')
    .populate('clinic')
    .exec((err, queue) => {
      if (err) return res.status(404).send('Not found');
      res.json(queue);
    });
}

exports.postQueue = (req, res) => {

  // only allow user to post if logged in
  if(req.user){
    cloudinary.uploader.upload(req.file.path, (result) => {
      let newQueue = new Queue({
        pic: result.secure_url || "",
        picPublicId: result.public_id || "",
        comment: req.body.comment || "",
        user: req.body.user_id || "",
        clinic: req.body.clinic_id || ""
      });

      if(req.body.status!=="" && (req.user.role==="clinicAdmin" || "appAdmin") && req.body.clinic_id === req.user.myClinic){
        // Save the status only if user's role is clinicAdmin of that clinic
        newQueue.status = req.body.status;

        // Loop through the subscribe collection and sent SMS via Twillo
        Subscribe.find({'clinic':req.body.clinic_id}).populate('user').populate('clinic').exec((err,subscribes) => {
          if(subscribes.length >0){
            subscribes.forEach((subscribe,index) => {
              if(subscribe.user.contact.length >7){
                /*
                * Twilio function
                */
                twilio.messages.create({
                    to: subscribe.user.contact,
                    from: process.env.TWILLO_FROM_NUMBER,
                    body: '[Updates] '+ subscribe.clinic.properties.name_full + ' have posted a new Queue status: ' + req.body.status
                }, (err,message) => {
                  if(err) {console.log(err); return;}
                })
              }
            })
          }
        })
      }

      Clinic.findOne({"_id": req.body.clinic_id}, (err,clinic) => {
        // ensure that latest queue is the first in the array
        clinic.queue.unshift(newQueue._id)
        clinic.save((err)=>{
          if(err){console.log(err); return;}
        });
      })

      User.findOne({"_id": req.body.user_id}, (err,user) => {
        user.queue.push(newQueue._id)
        user.save((err)=>{
          if(err){console.log(err); return;}
        });
      })

      // save new Queue to database
      newQueue.save((err) => {
        if(err){console.log(err); return;}
        res.json(newQueue);
      });

    })
    .then(

      // after cloudinary completes, delete the temporary storage of image in uploads
      fs.unlink(req.file.path, (err) => {
        if (err) {
              console.log("failed to delete local image:"+err);
          } else {
              console.log('successfully deleted local image');
          }
      })
    );
  }else{
    res.json("Please Login")
  }

}

//data possible suggestion ->
// {
//   queue_id: ......
//   queuePicPublicId: ....
//   clinic_id: ......
//   user_id: .....
// }

exports.deleteQueue = (user, data, cb) => {

  Queue.findOneAndRemove({'_id': data.queue_id}, (err,queue) => {

    // removing queue id from array in Clinic collection
    Clinic.findOneAndUpdate({'_id': data.clinic_id}, {
      '$pull':{'queue': data.queue_id}
    },(err, restraurant) => {
      if(err){console.log(err); return;}
    })

    // removing queue id from array in User collection
    User.findOneAndUpdate({'_id': data.user_id}, {
      '$pull':{'queue': data.queue_id}
    },(err, user) => {
      if(err){console.log(err); return;}
    })

    // Cloudinary function to remove pic
    cloudinary.uploader.destroy(data.queuePicPublicId, (err, result) => {
      console.log('cloudinary in delete queue, error', err);
      console.log('cloudinary in delete queue, result', result);
    })

    if(err){console.log(err); return;}

    // callback function when deleting in Queue collection is completed
    cb(data)
  })
}
