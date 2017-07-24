import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  type: {type: String},
  geometry : {
      type: {type: String},
      coordinates : {
          type : [Number],
          index : '2dsphere',
          // required : true
      }
  },
  properties : {
      type: String,
      name : String,
      name_full: String,
      ADDRESSFLOORNUMBER: String,
      LICENCE_TYPE: String,
      ADDRESSBUILDINGNAME: String,
      Telephone: String,
      ADDRESSPOSTALCODE: String,
      ADDRESSBLOCKHOUSENUMBER: String,
      ADDRESSUNITNUMBER: String,
      DESCRIPTION: String,
      ADDRESSSTREETNAME: String,
      time_created: Date,
      cluster : String,
      upvote: Number,
      downvote: Number,
      cluster : String,
      time_created: Date,
      queueQty : String,
      waitTime : String,
      currentQueue: [],
      historicalQueue: [],
      differenceQueue: String
  },
  queue: [{type: mongoose.Schema.Types.ObjectId, ref: 'Queue'}],
  subscribe: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subscribe'}],
},{
    timestamps: true
  });

const Clinic = mongoose.model('Clinic', clinicSchema);

/* Export the model */
module.exports = Clinic;