import Clinic from '../models/Clinic';
var cloudinary = require('cloudinary');


/********************************/
/* Return array of JSON objects */
/********************************/

exports.getAllClinic = (cb) => {
  // .populate('queue').populate('subscribe').exec(
  Clinic.find({}, (err,clinic) => {
    console.log(clinic)
    cb(clinic);
  })
}

//for testing purposes only (with postman)
exports.getClinic = (req,res) => {
  Clinic.find({}, (err, clinic) => {
    res.json(clinic);
  })
}

exports.postClinic = (req,res) => {
  const newClinic = new Clinic({
    type: req.body.type,
    geometry: {
      coordinates: req.body.coordinates,
    },
    properties: {
      name: req.body.name
    }
  });

  newClinic.save((err) => {
    if(err){console.log(err); return;}
    res.json(newClinic);
  })
}
