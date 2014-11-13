var detailsController = angular.module('detailsController', ['theRecipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe
  $scope.text = "Test";
  $scope.url = "";
  $scope.recipe = []
  $scope.timeExists = function() {
    if ($scope.recipeData.totalTime)
      return true;
    return false;
  }

  $scope.isEnhanced = detailsService.isEnhanced;
  $scope.ingredientsExist = function() {
    if (detailsService.getIngredients())
      return true;
    return false;
  }
  $scope.load = function() {
    var recipe_id = $window.location.href;
    recipe_id =recipe_id.slice(recipe_id.lastIndexOf('/')+1, recipe_id.length);
    // this is so bad I want to puke
    // if this is still here at the end of the semester, someone send an angry email to : Jayd_WTF_Are_You_Doing@saurdo.com
    var type = recipe_id[0] == "$" ? "Composition" : "yummly";
    recipe_id = type == "yummly" ? recipe_id.slice(recipe_id.lastIndexOf('/')+1, recipe_id.length) : recipe_id.slice(recipe_id.lastIndexOf('/')+2, recipe_id.length); 
    $http.post("/api/compositions/", {"recipeId" : recipe_id, "type": type}).success(function(data) {
      detailsService.setData(data);
      $scope.recipeData = detailsService.getData();
      $scope.ingredients = detailsService.getIngredients();
      $scope.recipe.push({
        name: $scope.recipeData.name,
        instructions: $scope.recipeData.instruction,
        img: $scope.recipeData.img
      });
    });
  };

  $scope.getComposition = function(index, comp){
    $scope.ingredients.splice(index, 1);
    var recipe_id = comp._id;
    var type = comp.type;
    $http.post("/api/compositions/", {"recipeId" : recipe_id, "type": type}).success(function(data) {
      $scope.ingredients = $scope.ingredients.concat(data.recipe);
      $scope.recipe.push({
        name: data.name,
        instructions: data.instruction,
        img: "http://i.imgur.com/Cey1Ud1.jpg"
      });
    });
  }
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }
  $scope.load(); //calling the load function so we can make the api call to populate the recipe data before the page loads

}]);