import Clinic from '../models/Clinic';
var cloudinary = require('cloudinary');


/********************************/
/* Return array of JSON objects */
/********************************/

exports.getAllClinic = (cb) => {
  Clinic.find({}).populate('queue').populate('subscribe').exec( (err,clinic) => {
    cb(clinic);
  })
}

exports.getClinic = (req,res) => {
  Clinic.find({}, (err, clinic) => {
    res.json(clinic);
  })
}

exports.postClinic = (req,res) => {
  const newClinic = new Clinic({
    type: req.body.type,
    properties: {
      name: req.body.name
    }
  });

  newClinic.save((err) => {
    if(err){console.log(err); return;}
    res.json(newClinic);
  })
}
