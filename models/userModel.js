const mongoose = require('mongoose');


// Mongoose Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name please!'],
        maxlength: [40, 'Name must have less or equal 40 characters'],
        minlength: [5, 'Name must have more or equal 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Email please!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password please!'],
        minlength: [8, 'Name must have more or equal 8 characters']
    },
    balance: {
        type: Number,
        default: 0,
        validate: {
            validator: function(val){
                val>=0;
            },
            message: 'Balance should be greater than 0'
        }
    }
});

// Document middleware
userSchema.pre('save', function(next){
    if (this.name && this.isModified('name')) {
    // Slugify the name (replace spaces with hyphens) and make it uppercase
    this.name = this.name.toLowerCase().toUpperCase();
    };

    if (this.email && this.isModified('email')) {
    // Make the password lowercase
    this.email = this.email.toLowerCase();
    };

    next();
});



// Mongoose Model
const User = mongoose.model('User', userSchema);

//TEST the data base

// const testUser = new User({
//     name: 'Test User 1',
//     email: 'testUser@gmail.com',
//     password: '12345678',
//     balance:150
// });

// testUser.save().then((doc)=>{
//     console.log(doc);
// }).catch((err)=>{
//     console.log(err);
// });

module.exports = User;