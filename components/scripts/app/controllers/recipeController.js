var recipeController = angular.module('recipeController', []);

recipeController.controller('RecipeController', ['$scope','$http', function($scope, $http) {

$scope.test = "Test";
$scope.count = '0';
$scope.icount = '0';
$scope.ingredient = [];
$scope.quantity = [];
$scope.unit = [];
$scope.instructions = [];
$scope.userName = "guest";
$scope.recipeName = "";

$scope.inputRecipe = function(recipe) {
      var url = '/api/compositions/new/';
      console.log($scope.ingredient);
      console.log($scope.quantity);
      console.log($scope.unit);
      var array = new Array();
      for(i=0; i<$scope.ingredient.length;i++){
        var ingObj = { "name":$scope.ingredient[i], "quantity":$scope.quantity[i], "unit":$scope.unit[i]};
        array.push(ingObj);
      }
      console.log(array);
      recipe = { "name":$scope.recipeName, "ingredients":array, "instruction":$scope.instructions, "user":$scope.userName};
      postObject = recipe;
      $http.post(url, postObject).success(function(data){
      });
}

}]);