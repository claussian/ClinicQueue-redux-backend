import mongoose from 'mongoose';

const privateClinicSchema = new mongoose.Schema({
  type: {type: String},
  'geometry' : {
      type: {type: String},
      'coordinates' : {
          'type' : [Number],
          'index' : '2dsphere',
          'required' : true
      }
  },
  'properties' : {
      'Name' : String,
      'queueImg' : String,
      'latestUser' : String,
      'timestamp': Date
  }
});

const PrivateClinic = mongoose.model('PrivateClinic', privateClinicSchema, 'privateclinics');

/* Export the model */
module.exports = PrivateClinic;
