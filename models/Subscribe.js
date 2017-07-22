import mongoose from 'mongoose';

const subscribeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
},{
    timestamps: true
});

const Subscribe = mongoose.model('Subscribe', subscribeSchema);

/* Export the model */
module.exports = Subscribe;
