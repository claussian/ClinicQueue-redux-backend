import Queue from '../models/Queue';
import User from '../models/User';
import cloudinary from 'cloudinary';
import fs from 'fs';

exports.getAllQueue = (req, res) => {
  Queue.find({}, (err, queue) => {
    res.json(queue);
  })
}

exports.postQueue = (req, res) => {
  cloudinary.uploader.upload(req.file.path, (result) => {
    const newQueue = new Queue({
      comments: req.body.comments || "",
      user: req.body.user_id || "",
      clinic: req.body.clinic_id || "",
      pic: result.secure_url || "",
      picPublicId: result.public_id || "",
    })

    newQueue.save((err) => {
      if(err){console.log(err); return;}
      res.json(newQueue);
    }

    Clinic.findOne({"_id": req.params.clinic_id}, (err,clinic) => {
      clinic.properties.queue.push(newQueue._id)
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

exports.deleteQueue = (req, res) => {
  Queue.findOneAndRemove({'_id':req.params.queueid}, (err,queue) => {

  Clinic.findOneAndUpdate({'_id':queue.clinic}, {
    '$pull':{'queue': req.params.id}
  },(err, restraurant) => {
    if(err){console.log(err); return;}
  })

  User.findOneAndUpdate({'_id':queue.user},{
    '$pull':{'reviews': req.params.id}
  },(err, user) => {
    if(err){console.log(err); return;}
  })

  if(err){console.log(err); return;}
  res.json(review);
})
}
