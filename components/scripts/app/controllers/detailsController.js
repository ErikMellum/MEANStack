var detailsController = angular.module('detailsController', ['recipeService']);
detailsController.controller('DetailsController', ['$scope' ,'detailsService', function($scope, detailsService) {
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
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }
}]);
