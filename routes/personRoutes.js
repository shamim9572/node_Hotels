const express = require('express');
const router = express.Router();

const Person = require('./../models/person');
const{jwtAuthMiddleware , generateToken} = require('./../jwt');

// Post route to add Person
router.post('/signup', async (req, res) => {
  try {
    const data = req.body  // assuming the request body contains the person data

    //create the new person document using the mongoes Model
    const newPerson = new Person(data);

    // save the new person data
    const response = await newPerson.save();
    console.log("Save the Data");

    const payload = {
      id:response.id,
      username: response.username
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is :", token);

    res.status(200).json({response: response, token:token});
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server Error" });

  }


})

// Login Route
router.post('./login',async(req, res) =>{
  try{
    //Extract username and Password from request body
    const{username, password} = req.body;

    //find the user by username
    const user = await Person.findOne({username: username});

    // if password does not exits or password does not match then return Error
    if(!user|| !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username and Password'});
    }

    // generate Token
    const payload = {
      id : user.id,
      username: user.username
    }
    const token = generateToken(payload);

    //return token as response
    res.json({token});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "internal server Error" });
  }
})
// profile route
router.get('/profile',jwtAuthMiddleware, async(req,res)=>{
  try{
    const userData = req.user;
    console.log('User Data', userData);

    const userId = userData.id;
    const user = await Person.findOne(userId);

    res.status(200).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "internal server Error" });
  }

})

// Get Method to get the person

router.get('/',jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetch");
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server Error" });

  }
})

router.get('/:workType', async (req, res) => {
  try {
    const workType = req.params.workType;  //Extract the work type from the URL Parameter  
    if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
      const response = await Person.find({ work: workType });
      console.log('response fetch');
      res.status(200).json(response);

    } else {
      req.status(400).json({ error: 'Internal server error' });

    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server data' });
  }
})

router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;    //Extract the id from the URL parameter
    const updatePersonData = req.body;  // Update data from the person

    const response = await Person.findByIdAndUpdate(personId, updatePersonData, {
      new: true,
      runValidators: true,
    })

    if (!response) {
      return res.status(400).json({ error: 'Person not found' })
    }
    console.log('data fetch');
    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server data' });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id;    //Extract the id from the URL parameter
    const response = await Person.findByIdAndDelete(personId);

    if (!response) {
      return res.status(400).json({ error: 'Person not found' })
    }
    console.log('data delete');
    res.status(200).json({ message: 'Person message Delete' });

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server data' });

  }

  })

  module.exports = router;
