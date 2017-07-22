import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  pic: String,
  picPublicId: String,
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
},{
    timestamps: true
  });

const Queue = mongoose.model('Queue', queueSchema);

/* Export the model */
module.exports = Queue;
