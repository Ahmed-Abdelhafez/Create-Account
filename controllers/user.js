const auth = require('../middleware')
const User = require('../models/user')

module.exports.renderSignUp = (req, res) => {
    res.send('signUp')
}

module.exports.signUp = async (req, res) => {
    let user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status('201').send({user, token})
    } catch (e) {
            res.status('400').send(e.message)
    }
}

module.exports.renderLogin = (req, res) => {
    res.send('login')
}

module.exports.login = async (req, res) => {
    try {
    const user = await User.findByCredentials(req.body.email || req.body.username, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    } 
}