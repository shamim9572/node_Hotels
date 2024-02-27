
const express = require('express');
const app = express()
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;

// Middleware Function

const logRequest = (req, res, next)=> {
  console.log(`[${new Date().toLocaleString()}] RequestMade Made to: ${req.originalUrl}`);
  next();  // move on the next phase
}
app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local',{session:false});
app.get('/',function (req, res) {
  res.send('Welcome to our Hotel ')
})

// import the router file
 const personRoutes = require('./routes/personRoutes');
 const menuItemRoutes = require('./routes/menuItemRoutes');

// Use the router
app.use('/person',localAuthMiddleware,personRoutes);
app.use('/menu', menuItemRoutes);

app.listen(PORT, ()=>{
  console.log('listening on port 3000')
})