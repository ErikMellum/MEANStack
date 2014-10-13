var detailsController = angular.module('detailsController', ['recipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe

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
    $http.post("/api/composition/", {"recipeId" : recipe_id}).success(function(data) {
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