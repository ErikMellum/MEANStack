var recipeController = angular.module('recipeController', []);

recipeController.controller('RecipeController', ['$scope','$http', function($scope, $http) {

$scope.test = "Test";
$scope.count = '0';
$scope.icount = '0';
$scope.ingredients = [];
$scope.currentIngredient = "";
$scope.instructions = [];
$scope.steps = [];
$scope.currentStep = "";
$scope.userName = "guest";
$scope.recipeName = "";
$scope.maxIngredients = 100; 
// $scope.inputRecipe = function(recipe) {
//       var url = '/api/compositions/new/';
//       console.log($scope.ingredients);
//       console.log($scope.quantity);
//       console.log($scope.unit);
//       var array = new Array();
//       for(i=0; i<$scope.ingredients.length;i++){
//         var ingObj = { "name":$scope.ingredients[i], "quantity":$scope.quantity[i], "unit":$scope.unit[i]};
//         array.push(ingObj);
//       }
//       console.log(array);
//       recipe = { "name":$scope.recipeName, "ingredients": $scope.ingredients, "instruction":$scope.instructions, "user":$scope.userName};
//       postObject = recipe;
//       $http.post(url, postObject).success(function(data){
//       });
// }
// $scope.addIngredient = function() {
//  
// }
$scope.addIngredient = function() {
    if($scope.currentIngredient != "")
    {
      var newIngredient = $scope.currentIngredient;
      $scope.ingredients.push(newIngredient);
      $scope.currentIngredient = ""
    }
    else
      alert("Nothing to add!")
 }

 $scope.removeIngredient = function(index) {
    if(index == 0)
      $scope.ingredients.splice(index, 1)
    else
      $scope.ingredients.splice(index, index);
 }

 $scope.addStep = function() {
    if($scope.currentStep != "")
    {
      var newStep = $scope.currentStep;
      $scope.steps.push(newStep);
      $scope.currentStep = ""
    }
    else
      alert("Nothing to add!")
 }

 $scope.removeStep = function(index) {
    if(index == 0)
      $scope.steps.splice(index, 1)
    else
      $scope.steps.splice(index, index);
 }
 }]);
