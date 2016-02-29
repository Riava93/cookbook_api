var express = require('express');
var User = require('../models/user');

var router = express.Router();


//Create user route
router.post('/', function(req, res) {
	if (!req.body.pwdString) {
		return res.status(400).json({ message: 'Missing Required Data' });
	}

	var newUser = new User(req.body);
	newUser.passwordHash = newUser.hashPassword(req.body.pwdString);

	newUser.save(function(err, user) {
		if (!err) {
			res.json({ message: 'success', user: user.toJSON() });
		} else {
			res.status(400).json({ message: 'failed', error: err});
		}
	});
});

router.route('/:user_id')

	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) { return res.status(404).json({ error: err }); }
			return res.json(user.toJSON());
		});
	})

	.delete(function(req, res) {
		var userId = req.params.user_id;
		User.findById(userId, function(err, user) {
			if (err) { return res.json({ error: err }); }

			user.remove();
			res.json({ message: 'success' });
		});
	});

module.exports = router;
