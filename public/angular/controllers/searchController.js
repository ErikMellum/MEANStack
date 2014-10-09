var searchController = angular.module('searchController', ['ngEnter']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', function($scope, $http, $window, detailsService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []
  $scope.match="";


  $scope.reset = function(){
       $scope.match = "";
       $scope.query_result.length = 0;
  }
   $scope.insert = function(ingredient){
    $scope.chosen_ingredients.push({name : ingredient}); 
    $scope.displayRecipes();
    $scope.reset();

   }
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
     $http.get('http://google.com').then(function(data){
      console.log(data);   
    });
  }
  $scope.switchAndDisplay = function(name){
       $scope.chosen_ingredients.push(name);
       $scope.displayRecipes();
       $scope.reset();
       
  }
  $scope.remove = function(index){
      $scope.chosen_ingredients.splice(index,1);
      $scope.displayRecipes();
  }
    $scope.details = function(recipe, index){
      var postObject = {"recipeId" : $scope.dataArray[index].id};
        $http.post("/api/composition/", postObject).success(function(data) {
         detailsService.setData(data);
        console.log(data);
         recipe.replace(" ", "%20"); //replacing the spaces in the reipe name with %20 ...url encoded convention
        $window.location.href = "/#/details/"+recipe; //redirecting the user to the details partial
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
    });
  }
  $scope.displayRecipes = function() {
    $scope.recipes.length = 0; //removing all recipe results 
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