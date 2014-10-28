var savingService = angular.module('savingService', ['ngResource', 'ingredientService']);


savingService.service('dataService', function(){
	//need to add ability to delete a specific ingredient from the service
  var chosen_ingredients=[]
  var recipes=[]
  var excluded_ingredients = []

  var clearData = function(){
      chosen_ingredients=[];
      recipes=[];
      excluded_ingredients = [];
  }
  var removeIngredient = function (container, index) {
    if (container == "chosen_ingredients")
       chosen_ingredients.splice(index,1);
    else
       excluded_ingredients.splice(index,1);
  }

  var addChosenIngredient = function(name) {
    chosen_ingredients.push(name); 
  }
   var addExcludedIngredient = function(name) {
   	excluded_ingredients.push(name); 
  }
  var clearRecipes = function() {
  	recipes = [];
  }
  var addRecipe = function(data){
  	recipes.push(data);
  }
  var getRecipes = function(){
  	  return recipes;	
  }
  var getChosenIngredients = function(){
      return chosen_ingredients;
  }

  var getExcludedIngredients = function(){
      return excluded_ingredients;
  }

  return {
    
   addChosenIngredient : addChosenIngredient,
   getChosenIngredients : getChosenIngredients,
   addExcludedIngredient : addExcludedIngredient,
   getExcludedIngredients : getExcludedIngredients,
   getRecipes : getRecipes,
   addRecipe : addRecipe,
   clearRecipes : clearRecipes,
   removeIngredient : removeIngredient,
   clearData : clearData
  };      
});
