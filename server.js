const app = require('./app');
//const dotenv = require('dotenv');

const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());


//dotenv.config({ path: './config.env' });

//Connect to mongoose
const mongoose = require('mongoose');

// User schema
const User        = require(`./models/userModel.js`);

//connection to Atlas via url
const uri = "mongodb+srv://erenelbetul:nolqkJ7jo1ieaJfS@bankapp.u3vsx5u.mongodb.net/";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false } };

mongoose
  .connect(uri, clientOptions)
  .then(() => console.log('DB connection successful!'));


  // const testUser = new User({
  //   name:"test name",
  //   email: "test@gmail.com",
  //   password: "12345678",
  //   balance: 100
  // });

  // testUser 
  //   .save()
  //   .then((data)=>{console.log(data)})
  //   .catch((err)=>{console.log(err)});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
