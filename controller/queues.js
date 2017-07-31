import Queue from '../models/Queue';
import Clinic from '../models/Clinic';
import User from '../models/User';
import Subscribe from '../models/Subscribe';
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
        // }else{
        //   res.json("Please provide queue status").then(
        //     fs.unlink(req.file.path, (err) => {
        //       if (err) {
        //             console.log("failed to delete local image:"+err);
        //         } else {
        //             console.log('successfully deleted local image');
        //         }
        //     })
        //   );
        // }
      }

    Clinic.findOne({"_id": req.body.clinic_id}, (err,clinic) => {
      // console.log(clinic)
      // ensure that latest queue is the first in the array
      clinic.queue.unshift(newQueue._id)
      clinic.save((err)=>{
        if(err){console.log(err); return;}
        res.json(newQueue);
      });

        if(req.body.status!=="" && (req.user.role==="clinicAdmin" || "appAdmin")){
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
  Queue.findOneAndRemove({'_id': data.queue_id}, (err,queue) => {

    Clinic.findOneAndUpdate({'_id': data.clinic_id}, {
      '$pull':{'queue': data.queue._id}
    },(err, restraurant) => {
      if(err){console.log(err); return;}
    })

    User.findOneAndUpdate({'_id': user._id}, {
      '$pull':{'queue': data.queue._id}
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
