var theRecipeService = angular.module('theRecipeService', ['ngResource', 'theIngredientService']);

theRecipeService.service('detailsService', function(){
  var recipeData= "";
  var ingredients = []; 

  var setData = function(data) {
      ingredients = [];
      for (var i =0; i < data.ingredientLines.length; i ++){
        if (data.ingredientLines[i] != data.ingredientLines[i+1])
          ingredients.push(data.ingredientLines[i]);
      }
      recipeData = data;
      return true;
  }
  var getIngredients = function(){
    return ingredients;
  }

  var getData = function(){
      return recipeData;
  }

  return {
    setData: setData,
    getData: getData,
    getIngredients: getIngredients
  };      
});
