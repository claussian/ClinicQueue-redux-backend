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
      name : String,
      name_full: String,
      time_created: Date,
      cluster : String,
      upvote: Number,
      downvote: Number,
      queueQty : String,
      waitTime : String,
      currentQueue: [],
      historicalQueue: [],
      differenceQueue: []
  },
  queue: [{type: mongoose.Schema.Types.ObjectId, ref: 'Queue'}],
  subscribe: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subscribe'}],
},{
    timestamps: true
  });

const Clinic = mongoose.model('Clinic', clinicSchema);

/* Export the model */
module.exports = Clinic;

// {"_id":{"$oid":"594a086191140e45d06f558d"},
// "type":"Feature",
// "properties":{
//   "Name":"CECILIA FAMILY CLINIC \u0026 SURGERY",
//   "description":"",
//   "timestamp":null,
//   "begin":null,
//   "end":null,
//   "altitudeMode":"clampToGround",
//   "tessellate":-1,
//   "extrude":0,
//   "visibility":-1,
//   "drawOrder":null,
//   "icon":null,
//   "snippet":"",
//   "queueImg":"",
//   "latestUser":""
// },"geometry":{
//   "type":"Point",
//   "coordinates":[103.9526394471581,1.36189785903623,0.0]}}
// {"_id":{"$oid":"594a086191140e45d06f5588"},"type":"Feature","properties":{"Name":"CARE MEDICAL CLINIC","description":"","timestamp":null,"begin":null,"end":null,"altitudeMode":"clampToGround","tessellate":-1,"extrude":0,"visibility":-1,"drawOrder":null,"icon":null,"snippet":"","queueImg":"","latestUser":""},"geometry":{"type":"Point","coordinates":[103.8863678473718,1.373312700838002,0.0]}}
