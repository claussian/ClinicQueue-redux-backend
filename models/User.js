import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {type: String, unique:true},
  password: String,
},{
  timestamps: true
});

/* Password hash middleware */

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if(err){
      return next(err);
    }
    else{
      bcrypt.hash(user.password, salt, (err,hash) => {
        if(err){
          return next(err);
        }
        console.log("password hashed");
        user.password = hash;
        next();
      });
    }
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      callb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
