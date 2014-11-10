var theRecipeService = angular.module('theRecipeService', ['ngResource', 'theIngredientService']);

theRecipeService.service('detailsService', function(){
  var recipeData= {};
  var ingredients = [];
  // default image
  var img = "http://i.imgur.com/Cey1Ud1.jpg";
  var enhancedIngredients = [];
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
          enhancedIngredients.push(data.recipe[i]);
        }
      }

      data.img = data.images[0] && data.images[0].hostedLargeUrl.length > 0 ? data.images[0].hostedLargeUrl : img;
      recipeData = data;
      return true;
  }
  var getIngredients = function(){
    return ingredients;
  }
  var getEnhancedIngredients = function(){
    return enhancedIngredients;
  }
 var isEnhanced = function(){
    console.log(type);
    return type != "yummly";
  }
  var getData = function(){
      return recipeData;
  }

  return {
    setData: setData,
    getData: getData,
    isEnhanced: isEnhanced,
    getEnhancedIngredients: getEnhancedIngredients,
    getIngredients: getIngredients
  };      
});
