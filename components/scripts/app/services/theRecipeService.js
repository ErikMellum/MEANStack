var theRecipeService = angular.module('theRecipeService', ['ngResource', 'theIngredientService']);

theRecipeService.service('detailsService', function(){
  var recipeData= "";
  var ingredients = [];
  var type = "yummly"; 

  var setData = function(data) {
      ingredients = [];
      if(data.ingredientLines){
        for (var i =0; i < data.ingredientLines.length; i ++){
          if (data.ingredientLines[i] != data.ingredientLines[i+1])
            ingredients.push(data.ingredientLines[i]);
        }
      }
      if(data.recipe){
        type = data.__t;
        for (var i =0; i < data.recipe.length; i ++){
          ingredients.push(data.recipe[i].name);
        }
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
