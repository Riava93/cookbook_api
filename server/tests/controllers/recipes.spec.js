var request = require('supertest');
var expect = require('chai').expect;
var User = require('../../models/user');
var models = require('../../models/recipe');
var Recipe = models.recipes;
var Ingredient = models.ingredients;


describe('RECIPES CONTROLLER', function() {
	var server;
	beforeEach(function(done) {
		delete require.cache[require.resolve('../../app')];
		server = require('../../app');
		done();
	});

	afterEach(function(done) {
		if (mongoose.connection.db) {
			User.remove({});
			Recipe.remove({});
			Ingredient.remove({});
		}
		server.close(done);
	});

	xit('should return an array of recipes', function testGetAllRecipes(done) {});

	xit('should create a new recipe', function testCreateRecipe(done) {});

	xit('should return a single recipe object', function testGetSingleRecipe(done) {});

	xit('should update a single recipe object', function testUpdateSingleRecipe(done) {});

	xit('should remove a single recipe from database', function testRemoveRecipe(done) {});

	xit('should return a list of all ingredients for recipe', function testGetIngredients(done) {});

	xit('should add an ingredient to a recipe', function testAddIngredient(done) {});

	xit('should return all recipes for a given user', function testGetAllUserRecipes(done) {});
});
