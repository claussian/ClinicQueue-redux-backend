import express from 'express';
import passport from 'passport';
import User from '../models/User';
import Queue from '../models/Queue';
import userController from '../controller/users';

const router = express.Router();

/* Verify user credentials */
router.get('/user', (req, res, next) => {
  if(!req.user){
    res.json(req.user);
  }else{
    User.findOne({'_id': req.user._id}).populate('queue').populate('subscribe').exec((err,user) => {
      if(err){console.log(err); return;}
        res.json(user);
    })
  }
});

/* Signup new user */
router.post('/signup', function(req, res, next) {
    User.findOne( {$or:[{ email: req.body.email },
                        { username:req.body.username}]}, (err, existingUser) => {

      console.log("Data: ",req.body.email, req.body.username, req.body.password, req.body.contact)

      if (existingUser) {
          console.log("Found existing user!")
          return res.json({'error':'login','message': 'This username/email already exists!'});
      }

      console.log("New user:");

      let user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.contact = req.body.contact;
      user.role = req.body.role || "";
      //if(user.myClinic)
      user.myClinic = req.body.myClinic || "";
      console.log(user);
      user.save((err) => {
        console.log("saving user...")
        if (err) {
          console.log("User save error"+err);
          return res.json({'error':'database','message': err});
        }
        req.logIn(user, (err) => {
        if (err) {
            console.log("User login error");
            return res.json({'error':'login','message': err});
        }
        console.log("User login success");
        res.json({'user':user});
        });
      });
    });
});

/* Validate user login */
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if(error) {
            console.log(error);
            return res.json({'error':'database','message': "Something went seriously wrong. Contact the dev team."});
        }
        if(!user) {
          return res.json({'error':'user','message': "Wrong password or email"})
        }
        /* req.login is a passport function that calls passport.serializeUser in passport.js */
        req.logIn(user, function(err) {
            if (err) {
              console.log("Login err", "Wrong password");
              return res.json({'error':'user','message': "Wrong password"})
            }
            return res.json(user);
        });
    })(req, res, next);
});

/* logout user */
router.get('/logout',(req, res, next) => {
  req.logout();
  res.json({'message': 'User logged out'});
});

/* update user profile information */
router.post('/account/profile', (req, res, next) => {
  let updateUsername = req.body.username;
  let updateEmail = req.body.email;
  let updatePassword = req.body.password;
  let updateContact = req.body.contact;
  let updateRole = req.body.role || "";
    //if(user.myClinic)
  let updateMyClinic = req.body.myClinic || "";
  let updateId = req.body.id;

  console.log("username: ", updateUsername);
  console.log("email: ", updateEmail);
  console.log("contact: ", updateContact);
  console.log("Password: ", updatePassword);
  console.log("myClinic: ", updateMyClinic);
  console.log("role: ", updateRole);
  console.log("id: ", updateId)

  User.findById(updateId, (err, user) => {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.contact = req.body.contact || '';
    user.role = req.body.role || '';
    user.myClinic = req.body.myClinic || '';
    user.save((err) => {
      if(err) {
        return next(err);
      }
      console.log('saved');
      res.send('saved');
    });
  });
});

/* update user password */
router.post('/account/password',(req, res, next) => {
  let newPassword = req.body.password;

  User.findById(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save((err) => {
      if(err) {
        return next(err);
      }
      console.log('updated password');
      res.send('update password');
    });
  });
});

/* account delete */
router.delete('/:id', (req, res, next) => {
  User.findOneAndRemove({_id: req.params.id},(err,user) =>{
    if(err) {
      return next(err);
    }
    //req.logout();
    console.log('Your account has been deleted.');
    res.json({'message': "User deleted!"});
    // user.subscribe.forEach( (subscribe, index) => {
    //
    // })
  });
});

/*  clear shared books */
// router.delete('/user/clearBooks', userController.removeUserSharedBooks);

export default router;

//testing
