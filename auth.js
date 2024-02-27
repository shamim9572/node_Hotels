// sets up Passport with a local authentication strategy, 
//using a Person model for user data. - Auth.js file

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/person');

passport.use(new LocalStrategy(async (USERNAME,password, done)=>{
    //authentication logic here
    try{
      //console.log('Received Credentials', USERNAME, password);
      const user = await Person.findOne({username:USERNAME});
      if(!user)
        return done(null, false,{message:'Incorrect Username'});
  
    const isPasswordMatch = await user.comparePassword(password);
      if(isPasswordMatch)
        return done(null, user);
  
        else{
          return done(null, false,{message:'Incorrect Password'});
        }
  
    }catch(err){
        return done(err);
    }
  }))
  module.exports = passport;
