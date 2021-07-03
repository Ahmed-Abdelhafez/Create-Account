const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema



const UserSchema = new Schema({
    username: {
        type: String,
        required: 'username can\'t be empty',
        unique: true
    },
    name: {
        type: String,
        required: 'Name can\'t be empty'
    },
    email: {
         type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength : [8,'Password must be atleast 8 character long']
    },
    address: {
        type: String
    }, 
    mobile: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign( { _id: user._id.toString() }, process.env.JWT_SECRET )
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token 
}

UserSchema.statics.findByCredentials = async (loginMethod, password) => {
    const user = await User.findOne({ email: loginMethod }) || await User.findOne({ username: loginMethod })
    if(!user){
        throw new Error('Unable to login')
    }    

    const isMatch = await bcrypt.compare(password, user.password)    
    if(!isMatch){
        throw new Error('Unable to login')
    } 
    return user 
}

UserSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(val)
}, 'Invalid e-mail.')


UserSchema.pre('save', async function (next) {
    const user = this    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }    
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User