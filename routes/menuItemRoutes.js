const express = require('express');
const router = express.Router();

const MenuItem = require('./../models/MenuItem');

// Post route to add menuItem
router.post('/y', async(req, res)=>{
    try{
      const data = req.body
      const newMenu = new MenuItem(data);
  
      const response = await newMenu.save();
      console.log('Save the Menu Data');
      res.status(200).json(response);
  
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  
    }
  })
  
  //Get route to add menuItem
  
  router.get('/',async(req, res) =>{
    try{
    const data = await MenuItem.find();
    console.log('data Fetch');
    res.status(200).json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server data'});
    }
  })

  module.exports = router;