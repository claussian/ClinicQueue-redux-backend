import mongoose from 'mongoose';

const polyClinicSchema = new mongoose.Schema({
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
      'name' : String,
      'name_full': String,
      'time_created': Date,
      'queue' : String,
      'cluster' : String,
      'waitTime' : String
  }
});

const Clinic = mongoose.model('Clinic', polyClinicSchema, 'clinics');

/* Export the model */
module.exports = Clinic;
