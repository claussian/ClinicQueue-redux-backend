import Queue from '../models/Queue';
import Clinic from '../models/Clinic';
import User from '../models/User';
import Subscribe from '../models/Subscribe';
import cloudinary from 'cloudinary';
import fs from 'fs';
import {twilio} from '../app';
// const twilio = require('twilio')('ACf93f0fb06fa820f82a9ff4eed14241ae', '9bdc31cb5da59c05f2d629892e06bfdd');


// Controller accepts callback 'cb' as an argument
// Cb will only exceute on completion of async database operation 'Queue.find()'
exports.getAllQueue = (cb) => {
  Queue.find({}).populate('clinic').populate('user').exec( (err, queues) => {
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
  console.log("got request getQueue");

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
  console.log("controller reached")
  if(req.user){
    cloudinary.uploader.upload(req.file.path, (result) => {
      let newQueue = new Queue({
        pic: result.secure_url || "",
        picPublicId: result.public_id || "",
        comment: req.body.comment || "",
        user: req.body.user_id || "",
        clinic: req.body.clinic_id || ""
      });

      if((req.user.role === "clinicAdmin" || "appAdmin") && req.body.clinic_id===req.user.myClinic){
        // if(req.body.status!==""){
          newQueue.status = req.body.status;
      }

      if(req.body.status!=="" && (req.user.role==="clinicAdmin" || "appAdmin")){
        Subscribe.find({'clinic':req.body.clinic_id}).populate('user').populate('clinic').exec((err,subscribes) => {

          subscribes.forEach((subscribe,index) => {
            console.log('twillo will send to user contact: '+ subscribe.user.contact);
            console.log('for clinic: ' + subscribe.clinic.properties.name_full);
            console.log('sending clinic status' + req.body.status);
            /*
            * To put twillo codes in here
            */
            if(subscribe.user.contact.length >7){
              twilio.messages.create({
                  to: '+65'+ subscribe.user.contact,
                  from: '+18304200023',
                  body: '[Updates] '+ subscribe.clinic.properties.name_full + ' have posted a new Queue status: ' + req.body.status
              }, (err,message) => {
                if(err) {console.log(err); return;}
                console.log(message.sid);
              })
            }

          })

        })
      }

      Clinic.findOne({"_id": req.body.clinic_id}, (err,clinic) => {
        console.log("clinic findone reached");
        // ensure that latest queue is the first in the array
        clinic.queue.unshift(newQueue._id)
        console.log(clinic);
        clinic.save((err)=>{
          console.log("saving updated clinic with newqueue");
          if(err){console.log(err); return;}
        });
      })

      User.findOne({"_id": req.body.user_id}, (err,user) => {
        user.queue.push(newQueue._id)
        user.save((err)=>{
          if(err){console.log(err); return;}
        });
      })

      newQueue.save((err) => {
        if(err){console.log(err); return;}
        res.json(newQueue);
      });


    })
    .then(
      fs.unlink(req.file.path, (err) => {
        if (err) {
              console.log("failed to delete local image:"+err);
          } else {
              console.log('successfully deleted local image');
          }
      })
    );
  }else{
    res.json("Please Login").then(
      fs.unlink(req.file.path, (err) => {
        if (err) {
              console.log("failed to delete local image:"+err);
          } else {
              console.log('successfully deleted local image');
          }
      })
    );
  }

}

//data is ?? possible suggestion ->
// {
//   queue_id: ......
//   queuePicPublicId: ....
//   clinic_id: ......
//   user_id: .....
// }
/* Deleting photos in cloudinary
function destroy(public_id, options, callback)
cloudinary.v2.uploader.destroy('zombie', function(error, result){console.log(result)});
*/

exports.deleteQueue = (user, data, cb) => {
  // console.log(user)
  // console.log(data)

  Queue.findOneAndRemove({'_id': data.queue_id}, (err,queue) => {

    Clinic.findOneAndUpdate({'_id': data.clinic_id}, {
      '$pull':{'queue': data.queue_id}
    },(err, restraurant) => {
      if(err){console.log(err); return;}
    })

    User.findOneAndUpdate({'_id': data.user_id}, {
      '$pull':{'queue': data.queue_id}
    },(err, user) => {
      if(err){console.log(err); return;}
    })

    cloudinary.uploader.destroy(data.queuePicPublicId, (err, result) => {
      console.log('cloudinary in delete queue, error', err);
      console.log('cloudinary in delete queue, result', result);
    })

    if(err){console.log(err); return;}
    cb(data)
  })
}
