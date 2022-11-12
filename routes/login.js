const express   = require('express')
const router    = express.Router()
const bcrypt    = require('bcrypt')
const DB        = require('../app')

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) => {
    if (req.session.user) res.status(401)
    if (!req.body.email || !req.body.password) res.status(400)

    DB.select(['*'], 'users', {condition: `email = '${req.body.email}'`}, result => {
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, same) => {
                if (err) res.send(err)

                if (same) {
                    req.session.regenerate(err => {
						if (err) throw err

						req.session.user = {uuid: result[0].uuid, email: req.body.email, username: result[0].username}
						req.session.save(err => {
							if (err) throw err
							res.redirect('/')
						})
					})
                } else res.render('login', {error: 'Incorrect password.'})
            })
        } else res.render('login', {error: 'Email not found.'})
    })
})

module.exports = router