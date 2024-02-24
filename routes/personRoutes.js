const express = require('express');
const router = express.Router();

const Person = require('./../models/person');

// Post route to add Person
router.post('/', async (req, res) => {
  try {
    const data = req.body  // assuming the request body contains the person data

    //create the new person document using the mongoes Model
    const newPerson = new Person(data);

    // save the new person data
    const response = await newPerson.save();
    console.log("Save the Data");
    res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server Error" });

  }


})

// Get Method to get the person

router.get('/', async (req, res) => {
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
