var searchController = angular.module('searchController', ['ngEnter', 'recipeService']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', function($scope, $http, $window, detailsService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []  
  $scope.excluded_ingredients = []
  $scope.match="";

  $scope.reset = function(){
       $scope.match = "";
       $scope.query_result.length = 0;
  }
   $scope.insert = function(ingredient){
    if (ingredient.toLowerCase().substr(0,3) == "not"){ 
      $scope.excluded_ingredients.push({name : ingredient.substr(4, ingredient.length)}); 
    } else{
      $scope.chosen_ingredients.push({name : ingredient}); 
    }
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
    var postObject = {};
    var url = '/api/ingredients/';
    if (match.toLowerCase().substr(0,3) == "not" && match.length > 4){
      postObject = {"ingredient" : match.substr(4, match.length)};
    } 
    else {
      postObject = {"ingredient" : match};
    }
      $http.post(url, postObject).success(function(data) {
        $scope.query_result = data;
      });
  }

    /* whoever put this, it was causing an access-origin error
    //  $http.get('http://google.com').then(function(data){
    //   console.log(data);   
    // });
    */
  $scope.switchAndDisplay = function(name){
       if ($scope.match.toLowerCase().substr(0,3) == "not"){
        $scope.excluded_ingredients.push(name);
      } else {
       $scope.chosen_ingredients.push(name);
      }
       $scope.displayRecipes();
       $scope.reset();
       
  }
  $scope.remove = function(container, index){
      container.splice(index,1);
      $scope.displayRecipes();
  }
    $scope.details = function(index){
      var postObject = {"recipeId" : $scope.dataArray[index].id};
        $http.post("/api/composition/", postObject).success(function(data) {
         if (detailsService.setData(data)){
          $window.location.href = "/#/details/"+data.id; //redirecting the user to the details partial
      }
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
    });
  }
  $scope.displayRecipes = function() {
    $scope.recipes = [];
    if ($scope.chosen_ingredients.length) {
      var url = '/api/composition/withIngredients/'
      var allowedIngredients = new Array();
      $scope.chosen_ingredients.forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
      });
      var excludedIngredients = new Array();
      $scope.excluded_ingredients.forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);
      });
      var postObject = {"ingredients" : allowedIngredients, "excluded" : excludedIngredients};
        $http.post(url, postObject).success(function(data) {
          $scope.dataArray = data;
            data.forEach(function(recipe){
              $scope.recipes.push({name:recipe.recipeName});
          });
        });
      }
  }
}]);