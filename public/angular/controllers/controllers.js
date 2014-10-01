var TheControllers = angular.module('TheControllers', ['recipeService']);

TheControllers.controller('SearchController', ['$scope','$http', 'detailsService', function($scope, $http, detailsService) {

$scope.chosen_ingredients=[]
$scope.recipes=[]
$scope.dataArray=[]
$scope.query_result = []
$scope.match="";

/**
 * Queries API for ingredients that begin with match
 * Who: Jayd
 * @match  {string}     match the search input
 * @return {data}       result of our query
 */
$scope.queryIngredients = function(match)
{
  var url = '/api/ingredients/';
  var postObject = {"ingredient" : match};
  $http.post(url, postObject).success(function(data) {
    $scope.query_result = data;
  });
}

$scope.switchAndDisplay = function(name, container, index){
    container.splice(index,1);
     $scope.chosen_ingredients.push(name);
     $scope.recipes.length = 0; //removing all recipe results 
     $scope.displayRecipes();
     // reset
     $scope.match = "";
     $scope.query_result.length = 0;
     
}
$scope.remove = function(container, index){
    container.splice(index,1);
    //remove all recipes because we have no ingredients chosen || we have removen an 'ingredient' and we need to empty the recipe array to render a new recipe array later
   if($scope.chosen_ingredients.length == 0 || container != $scope.recipes){ 
     $scope.recipes.length = 0; //removing all recipe results
    }


   //if we arent removing a recipe, display the new recipe list
   if (container != $scope.recipes) { 
     $scope.displayRecipes();
   }
}
  $scope.details = function(recipe, index){
    detailsService.setName(recipe); //setting the name in the service so the DetailsController can use it later
    // console.log($scope.dataArray[index]);
  }
$scope.displayRecipes = function() {

  if ($scope.chosen_ingredients.length) {
    var url = '/api/composition/withIngredients/'
    var ingredientsArray = new Array();
    $scope.chosen_ingredients.forEach(function(ingredient){
        ingredientsArray.push(ingredient.name);
    });
    var postObject = {"ingredients" : ingredientsArray};
      $http.post(url, postObject).success(function(data) {
        $scope.dataArray = data;
          data.forEach(function(recipe){
            $scope.recipes.push({name:recipe.recipeName});
        });
      });
    }
}
}]);

TheControllers.controller('DetailsController', ['$scope' ,'detailsService', function($scope, detailsService) {
     $scope.recipeName = detailsService.getName(); //call to service for the name of recipe
}]);

TheControllers.controller('AboutController', ['$scope','$http', function($scope, $http) {
  $scope.names=["Name 1, Name 2, Name3"];
  $scope.test = "Hello";
}]);

TheControllers.controller('InputController', ['$scope','$http', function($scope, $http) {
$scope.test = "Test";
$scope.count = '0';
$scope.ingredient = [];
$scope.quantity = [];
$scope.unit = [];
$scope.recipeName = "";

$scope.inputRecipe = function(recipe) {
      var url = '/api/composition/new/';
      console.log($scope.ingredient);
      console.log($scope.quantity);
      console.log($scope.unit);
      var array = new Array();
      for(i=0; i<$scope.ingredient.length;i++){
        var ingObj = { "name":$scope.ingredient[i], "quantity":$scope.quantity[i], "unit":$scope.unit[i]};
        array.push(ingObj);
      }
      console.log(array);
      recipe = { "name":$scope.recipeName, "ingredients":array  };
      postObject = recipe;
      $http.post(url, postObject).success(function(data){
      });
}

}]);

TheControllers.controller('ApiScrapeController', ['$scope','$http', function($scope, $http) {
  $scope.test = "Test";
  $http.get('/api/tmpIngredients').success(function(data) {
       $scope.tmpIngredients=data;
    });
  
  $scope.abstractIngredients=[];
  $scope.primitiveIngredients=[];
  $scope.tmpIds=[];

}]);
