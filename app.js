require('dotenv').config();
const path = require("path");
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');


//---------------------------------------------------------------//
// Data Model
//---------------------------------------------------------------//
const User = require('./models/userModel');



//---------------------------------------------------------------//
// Middlewares
//---------------------------------------------------------------//
app.use(express.static(path.join(__dirname, '/frontend/build')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));





//---------------------------------------------------------------//
// Create New User
//---------------------------------------------------------------//
const addNewUser = async (req, res)=>{
  console.log("post req came");
  //res.send('post :', req.body);
  try {
    console.log(req.body);
    // use Salt to create different user passwords
    // general salt is 10 you can change
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    
    req.body.password = hashedPassword;
    
    const newUser = await new User(req.body);
    console.log(newUser)

    newUser.save().then((doc)=>{
    }).catch((err)=>{
      console.log(err);
    });
    console.log('new user: ', newUser);
    res.status(201).json({
      status: 'success',
      data: newUser
      });
  } catch (err){
    res.status(400).json({
      status : 'Fail',
      message : err
    })
  }
};



//---------------------------------------------------------------//
// Find All Users In DB
//---------------------------------------------------------------//
const findusers = async (req, res) =>{
  try{
    console.log('get all users request came');
    const allUsers = await User.find({});
    console.log(allUsers);
    res.status(200).json(allUsers);
  } catch (err){
      res.status(400).json({
      status : 'Fail',
      message : err
    })};
    
};


//---------------------------------------------------------------//
// LogIn User
//---------------------------------------------------------------//
const userLogin = async (req, res) => {
  //console.log(req.body);
  const { email } = req.body;
  console.log('post req came email', email)
  try {
    
    const user = await User.findOne({ email });

    // Email not found
    if (!user) {
      console.log('Server didnt find the user email');
      return res.status(404).json({ message: 'Email not found in the database' })
    };

    // 
    // check the user password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if(!passwordMatch) return res.status(401).send('Invalid password');
    
    // console.log('user is login')
    // const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10min'});
    // console.log({ accessToken : token});
    res.json(user);
    
  } catch (error) {
      res.status(400).json({
      status : 'Fail',
      message : err
    });
  };
};


//---------------------------------------------------------------//
// Update Data
//---------------------------------------------------------------//
const updateBalance = async (req, res) => {
    
    console.log("put request")
    const { email } = req.params;
    console.log(email);
    const { updatebalance } = req.params;
    console.log(updatebalance);

    try {
    //     // Find user by email
    const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("found oleyy")

    //     // Update user's balance
      user.balance = updatebalance;
      console.log("last check balance", updatebalance);
      await user.save();

      res.json({ message: 'Balance updated successfully' });
    } catch (error) {
        console.error('Error updating balance:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
};


//---------------------------------------------------------------//
// Find One User
//---------------------------------------------------------------//
const findOneUser = async (req, res) => {

  const { email } = req.params;
  console.log(email);
 
  try {

  const user = await User.findOne({ email });
    // Email not found
    if (!user) {
      console.log('Server didnt find the user email');
      return res.status(404).json({ message: 'Email not found in the database' })
    };
    res.json(user);

  } catch (error) {
      res.status(400).json({
      status : 'Fail',
      message : err
    });
  };
};




app.post(('/account/create'),addNewUser);
app.get(('/all'),findusers);
app.post(('/account/login'),userLogin);

app.get(('/account/findOne/:email'),findOneUser);

app.put(('/account/update/:email/:updatebalance'), updateBalance);

app.get(('/api/v1/:email'),findOneUser);

module.exports = app;
