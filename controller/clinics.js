import Polyclinic from '../models/Polyclinic'
import Privateclinic from '../models/Privateclinic'
var cloudinary = require('cloudinary');


/********************************/
/* Return array of JSON objects */
/********************************/

/* Return all Polyclinics JSON  */
exports.listPoly = (req, res) => { // to return JSON object
  Polyclinic.find({}, (err, clinics) => {
    if (err) {
      console.log(err);
    }
    //console.log(clinics)
    res.send(clinics);
    //res.json(clinics) // only for POST
  });
}
/* Return all Private clinics JSON */
exports.listPrivate = (req, res) => {
  Privateclinic.find({}, (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/* Return all Private clinic names JSON */
exports.listPolyNames = (req, res) => {
  Polyclinic.find({},'properties.name_full', (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/* Return all Private clinic names JSON */
exports.listPrivateNames = (req, res) => {
  Privateclinic.find({},'properties.Name', (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/**************************************/
/* Update photos in private clinic db */
/**************************************/

exports.updatePhoto = (req, res) => {
  console.log('reached controller ' + req.file.path);
  console.log('reached controller ' + req.body.clinicInput);
  cloudinary.uploader.upload(req.file.path, function (result) {
      Privateclinic.findOneAndUpdate({
        'properties.Name': req.body.clinicInput
      }, {
        'properties.queueImg': result.secure_url,
        'properties.timestamp': new Date()
      }, (err, updated) => {
        if (err) {
          throw err;
        }
        res.redirect('/report');
      });
    });
  }
