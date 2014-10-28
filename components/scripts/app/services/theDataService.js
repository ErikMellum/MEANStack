var theDataService = angular.module('theDataService', ['ngResource', 'theIngredientService']);


theDataService.service('dataService', function(){
	//need to add ability to delete a specific ingredient from the service
  var chosen_ingredients=[]
  var recipes=[]
  var excluded_ingredients = []
  var topRecipe0 =[];
  var topRecipe1 = []
  var addTopRecipe0 = function (data) {
    topRecipe0.push(data);
  }
  var addTopRecipe1 = function (data) {
    console.log(data);
    topRecipe1.push(data);
  }
  var addRecipe = function(data){
    recipes.push(data);
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
  var getRecipes = function(){
  	  return recipes;	
  }
  var getChosenIngredients = function(){
      return chosen_ingredients;
  }

  var getExcludedIngredients = function(){
      return excluded_ingredients;
  }
  var getTopRecipe0 = function () {
    return topRecipe0[0]
  }

  var getTopRecipe1 = function () {
    return topRecipe1[0]
  }
  var clearTopRecipes = function(){
     topRecipe0 = [];
     topRecipe1 = [];
  }
  var clearData = function(){
      chosen_ingredients=[];
      recipes=[];
      excluded_ingredients = [];
  }
  var clearRecipes = function() {
    recipes = [];
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
   clearData : clearData,
   clearTopRecipes : clearTopRecipes,
   getTopRecipe1 : getTopRecipe1 ,
   getTopRecipe0 : getTopRecipe0 ,
   addTopRecipe1 : addTopRecipe1,
   addTopRecipe0 : addTopRecipe0
  };      
});
