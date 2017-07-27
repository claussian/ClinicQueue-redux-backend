import Queue from '../models/Queue';
import Clinic from '../models/Clinic';
import User from '../models/User';
import cloudinary from 'cloudinary';
import fs from 'fs';


// Controller accepts callback 'cb' as an argument
// Cb will only exceute on completion of async database operation 'Queue.find()'
exports.getAllQueue = (data,cb) => {
  Queue.find({}, (err, queues) => {
      cb(queues);
  })
}

exports.postQueue = (req, res) => {
  // console.log("controller reached")
  cloudinary.uploader.upload(req.file.path, (result) => {
    let newQueue = new Queue({
      pic: result.secure_url || "",
      picPublicId: result.public_id || "",
      status: req.body.status || "",
      comment: req.body.comment || "",
      user: req.body.user_id || "",
      clinic: req.body.clinic_id || "",
      status: req.body.status || "",
    });

    // console.log(newQueue)
    newQueue.save((err) => {
      if(err){console.log(err); return;}
      res.json(newQueue);
    });


    Clinic.findOne({"_id": req.body.clinic_id}, (err,clinic) => {
      // console.log(clinic)
      clinic.queue.push(newQueue._id)
      clinic.save((err)=>{
        if(err){console.log(err); return;}
      });

      if(req.body.status){
        Subscribe.find({'clinic':req.body.clinic_id}).populate('user').exec((err,subscribes) => {

          subscribes.forEach((subscribe,index) => {
            console.log('twillo will send to user contact: '+ subscribe.user.contact);
            console.log('for clinic: ' + clinic.properties.name_full);
            console.log('sending clinic status' + req.body.status);
            /*
            * To put twillo codes in here
            */
          })

        })
      }

    })

    User.findOne({"_id": req.body.user_id}, (err,user) => {
      user.queue.push(newQueue._id)
      user.save((err)=>{
        if(err){console.log(err); return;}
      });
    })


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
}

//data is ?? possible suggestion ->
// {
//   queue_id,
//   clinic_id,
//   user_id
// }
/* Deleting photos in cloudinary
function destroy(public_id, options, callback)
cloudinary.v2.uploader.destroy('zombie', function(error, result){console.log(result)});
*/

exports.deleteQueue = (data, cb) => {
  Queue.findOneAndRemove({'_id': data}, (err,queue) => {

    Clinic.findOneAndUpdate({'_id': queue.clinic}, {
      '$pull':{'queue': queue._id}
    },(err, restraurant) => {
      if(err){console.log(err); return;}
    })

    User.findOneAndUpdate({'_id': queue.user}, {
      '$pull':{'queue': queue._id}
    },(err, user) => {
      if(err){console.log(err); return;}
    })

    cloudinary.uploader.destroy(queue.picPublicId, (err, result) => {
      console.log(result);
    })

    if(err){console.log(err); return;}
    cb(queue)
  })
}
