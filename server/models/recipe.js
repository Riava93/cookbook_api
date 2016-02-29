var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientSchema = Schema({
	name: { type: String, required: true },
	quantity: Number,
	measurement: String,
	meta: String,
});

var RecipeSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	owner: String,
	steps: { type: Array, default: [] },
	ingreds: [IngredientSchema],
	createdAt: { type: Date, default: Date.now }
});

exports.ingredients = mongoose.model('Ingredient', IngredientSchema);
exports.recipes = mongoose.model('Recipe', RecipeSchema);
