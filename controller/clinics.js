import Clinic from '../models/Clinic';
import cloudinary from 'cloudinary';


exports.getAllClinic = (cb) => {
  // query Clinic collection in db and populate necessary info from queue and subscribe collections
  Clinic.find({}).populate('queue').populate('subscribe').exec( (err,clinic) => {
    // callback function for socket io
    cb(clinic);
  })
}
