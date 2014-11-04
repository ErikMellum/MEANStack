var detailsController = angular.module('detailsController', ['theRecipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe
  $scope.text = "Test";
  $scope.url = "";
  $scope.timeExists = function() {
    if ($scope.recipeData.totalTime)
      return true;
    return false;
  }
  $scope.ingredientsExist = function() {
    if ($scope.recipeData.ingredientLines)
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
     });
  }
  $scope.load(); //calling the load function so we can make the api call to populate the recipe data before the page loads
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }

}]);