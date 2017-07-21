import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  type: {type: String},
  geometry : {
      type: {type: String},
      coordinates : {
          type : [Number],
          index : '2dsphere',
          required : true
      }
  },
  properties : {
      name : String,
      name_full: String,
      time_created: Date,
      cluster : String,
      queue: [{type: mongoose.Schema.Types.ObjectId, ref: 'Queue'}],
      upvote: Number,
      downvote: Number,
      queueQty : String,
      waitTime : String,
      currentQueue: [],
      historicalQueue: [],
      differenceQueue: [],
      subscribe: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subscribe'}],
  }
},{
    timestamps: true
  });

const Clinic = mongoose.model('Clinic', clinicSchema);

/* Export the model */
module.exports = Clinic;
