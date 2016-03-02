var request = require('supertest');
var expect = require('chai').expect;
var User = require('../../models/user');
var models = require('../../models/recipe');
var Recipe = models.recipes;
var Ingredient = models.ingredients;

var mongoose = require('mongoose');

function createRecipe(server, done, cb) {
	var recipeDetails = {
		owner: 1,
		name: 'Pop tarts',
		description: 'Not particularly good, but they\'re okay.'
	};

	request(server)
	.post('/api/recipes')
	.set('Accept', 'application/json')
	.send(recipeDetails)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
		expect(res.body.message).to.equal('success');
		if (done) done();
		if (cb) cb(res.body.recipe);
	});
}

function handleRemove(err) {
	if (err) throw err;
}

describe('RECIPES CONTROLLER', function() {
	var server;
	beforeEach(function(done) {
		delete require.cache[require.resolve('../../app')];
		server = require('../../app');
		done();
	});

	afterEach(function(done) {
		if (mongoose.connection.db) {
			User.remove({}, handleRemove);
			Recipe.remove({}, handleRemove);
			Ingredient.remove({}, handleRemove);
		}
		server.close(done);
	});

	it('should return an array of recipes', function testGetAllRecipes(done) {
		request(server)
		.get('/api/recipes')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			done();
		});
	});

	it('should create a new recipe', function testCreateRecipe(done) {
		createRecipe(server, done);
	});

	it('should return a single recipe object', function testGetSingleRecipe(done) {
		createRecipe(server, null, function(recipe) {
			request(server)
			.get('/api/recipes/' + recipe._id)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				expect(res.body.name).to.equal('Pop tarts');
				done();
			});
		});
	});

	it('should update a single recipe object', function testUpdateSingleRecipe(done) {
		createRecipe(server, null, function(recipe) {
			var updates = {
				name: 'Deviled Eggs'
			};

			request(server)
			.put('/api/recipes/' + recipe._id)
			.set('Accept', 'application/json')
			.send(updates)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				expect(res.body.message).to.equal('success');
				done();
			});
		});
	});

	it('should remove a single recipe from database', function testRemoveRecipe(done) {
		createRecipe(server, null, function(recipe) {
			request(server)
			.delete('/api/recipes/' + recipe._id)
			.expect('Content-Type', /json/)
			.expect(200, done);
		});
	});

	it('should return a list of all ingredients for recipe', function testGetIngredients(done) {
		createRecipe(server, null, function(recipe) {
			request(server)
			.get('/api/recipes/' + recipe._id + '/ingredients')
			.expect('Content-Type', /json/)
			.expect(200, done);
		});
	});

	it('should add an ingredient to a recipe', function testAddIngredient(done) {
		createRecipe(server, null, function(recipe) {
			var ingredient = {
				name: 'carrots',
				description: 'Good for your eyes.',
				meta: 'sliced',
				measurement: 'cups'
			};

			request(server)
			.post('/api/recipes/' + recipe._id + '/ingredients')
			.set('Accept', 'application/json')
			.send(ingredient)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				expect(res.body.recipe.ingreds.length).to.equal(1);
				done();
			});
		});
	});

	it('should return all recipes for a given user', function testGetAllUserRecipes(done) {
		createRecipe(server, null, function(recipe) {

			request(server)
			.get('/api/recipes/users/1')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				expect(res.body.length).to.equal(1);
				expect(res.body[0].name).to.equal('Pop tarts');
				done();
			});
		});
	});
});
