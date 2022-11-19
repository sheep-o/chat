const express   = require('express')
const router    = express.Router()

const DB = require('../app')

router.get('/:type', (req, res) => {
    if (req.params.type == 'user') {
        if (!req.query.name || req.query.name == '' || req.query.name.replace(' ', '') == '') {
            res.status(400).send([])
        } else {
            const name = req.query.name

            DB.select(['*'], 'users', {condition: `username LIKE '%${req.query.name}%'`}, result => {
                res.send(result)
            })
        }
    }
})

module.exports = router