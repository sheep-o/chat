const express   = require('express')
const router    = express.Router()
const DB        = require('../app')

router.get('/:id', (req, res) => {
    if (!req.session.user) res.redirect('/login')

    DB.select(['*'], 'users', {condition: `uuid = '${req.params.id}'`}, results => {
        if (results.length > 0) {

            DB.select(['*'], 'messages', {condition: `(author = '${req.session.user.uuid}' AND recipient = '${req.params.id}') OR (author = '${req.params.id}' AND recipient = '${req.session.user.uuid}')`}, posts => {
                res.render('chat', {user: req.session.user, recip: results[0], posts: posts.reverse()})  
            })

        } else res.status(400).send('no user found')
    })
})

module.exports = router