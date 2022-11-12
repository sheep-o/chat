const express   = require('express')
const router    = express.Router()

router.get('/', (req, res) => {
	if (req.session) req.session.destroy()

	res.redirect('..')
})

module.exports = router