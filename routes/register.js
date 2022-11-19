const express   = require('express')
const router    = express.Router()
const bcrypt    = require('bcrypt')
const DB        = require('../app')
const {uuid}    = require('uuidv4')

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', (req, res) => {
    if (req.session.user) res.status(401)
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirmPassword) res.status(400)
    if (req.body.password !== req.body.confirmPassword) res.render('register', {error: 'Password and confirm password are not the same.'})

    bcrypt.hash(req.body.password, 7)
    .then(hash => {
        DB.insert({
            uuid: uuid(),
            username: req.body.username,
            id: (Math.floor(Math.random() * 9999)).pad(4),
            email: req.body.email,
            password: hash,
            friends: '[]'
        }, 'users', _ => {
            console.log('inserted one row')
            res.redirect('/login')
        })
    })
    .catch(err => {
        console.log(err)
        res.send('ERROR')
    })
})

module.exports = router