var express = require('express');
var router = express.Router();
var models = require('../models/recipe');
var Recipe = models.recipes;
var Ingredient = models.ingredients;


router.route('/')
	//GET all recipes
	.get(function(req, res) {
		Recipe.find(function(err, recipes) {
			if (err) {
				res.send(err);
			}
			res.json(recipes);
		});
	})

	//CREATE new recipe
	.post(function(req, res) {
		if (!req.body.owner) { res.send({ error: "Must be associated with a user." }); }

		var recipe = new Recipe(req.body);

		recipe.save(function(err, recipe) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'success', recipe: recipe });
		});
	});

//GET, REMOVE, UPDATE single recipe
router.route('/:recipe_id')
	.get(function(req, res) {
		Recipe.findById(req.params.recipe_id, function(err, recipe) {
			if (err) {
				res.send(err);
			}
			res.json(recipe);
		});
	})

	.put(function(req, res) {
		var newRecipe = req.body;

		if (!newRecipe) { res.json({ message: 'No upates given' }); }

		Recipe.update(req.params.recipe_id, { $set: newRecipe }, null, function(err, recipe) {
			if (err) { res.send(err); }
			res.json({ message: 'success', recipe: recipe });
		});
	})

	.delete(function(req, res) {
		Recipe.findById(req.params.recipe_id, function(err, recipe) {
			if (err) { res.send(err); }

			recipe.remove();
			res.json({ message: 'success' });
		});
	});

router.route('/:recipe_id/ingredients')
	.get(function(req, res) {
		Ingredient.find({owner: req.params.recipe_id}, function(err, ingredients) {
			if (err) { res.send(err); }
			res.json(ingredients);
		});
	})

	.post(function(req, res) {
		var postData = req.body;

		Recipe.findById(req.params.recipe_id, function(err, recipe) {
			if (err) { res.send(err); }
			recipe.ingreds.push(postData);
			recipe.save();

			res.json({ message: 'success', recipe: recipe });
		});
	});

router.get('/users/:user_id', function(req, res) {
	Recipe.find({owner: req.params.user_id}, function(err, recipes) {
		if (err) { res.json({ error: err }); }
		res.json(recipes);
	});
});

module.exports = router;
