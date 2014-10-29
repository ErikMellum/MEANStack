var recipeController = angular.module('recipeController', ['ngEnter', 'theIngredientService']);

recipeController.controller('RecipeController', ['$scope','$http', 'Composition', 'PrimitiveIngredient', 'AbstractIngredient', 'TmpIngredient',
  function($scope, $http, Composition, PrimitiveIngredient, AbstractIngredient, TmpIngredient) {
$scope.combinedIngredients = [];
// needs to be done in a callback because find is actually a promise, and completely asynchronous
Composition.find(function(compResult){

  compResult = compResult.map(function(comp){ comp.type = "composition"; return comp;});
  $scope.combinedIngredients = $scope.combinedIngredients.concat(compResult);
});

PrimitiveIngredient.find(function(primResult){
  primResult = primResult.map(function(prim){ prim.type = "primitive"; return prim;});
  $scope.combinedIngredients = $scope.combinedIngredients.concat(primResult);
});

AbstractIngredient.find(function(abstResult){
  abstResult = abstResult.map(function(abst){ abst.type = "abstract"; return abst;});
  $scope.combinedIngredients = $scope.combinedIngredients.concat(abstResult);
});

$scope.test = "Test";
$scope.count = '0';
$scope.icount = '0';
$scope.ingredients = [];
$scope.currentIngredient = "";
$scope.steps = [];
$scope.currentStep = "";
$scope.userName = "guest";
$scope.recipeName = "";
$scope.maxIngredients = 100; 
$scope.inputRecipe = function() {

var url = '/api/compositions/new/';
console.log($scope.userName);
console.log($scope.recipeName);
console.log($scope.ingredients);
console.log($scope.steps);
recipe = { "name":$scope.recipeName, "ingredients": $scope.ingredients, "instruction":$scope.steps, "user":$scope.userName};
postObject = recipe;
$http.post(url, postObject).success(function(data){
});
}

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

$scope.setIngredient = function(ingredient){
      $scope.currentIngredient = ingredient;
  }

 }]);
