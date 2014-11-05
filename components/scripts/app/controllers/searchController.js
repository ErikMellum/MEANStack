var searchController = angular.module('searchController', ['ngEnter', 'theRecipeService', 'theDataService', 'ngAnimate', 'ngConfirm']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', 'dataService', function($scope, $http, $window, detailsService, dataService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []  
  $scope.excluded_ingredients = []
  $scope.match="";
  $scope.topRecipes = []

  $scope.clearData = function(){
    // location.reload();
    dataService.clearData();
    $scope.chosen_ingredients=[];
    $scope.dataArray=[];
    $scope.query_result = [];  
    $scope.excluded_ingredients = [];
    $scope.match="";
    $scope.recipes = [];
    $scope.topRecipes = []
    setTimeout(function(){
      $scope.recipes = [];
      $scope.topRecipes = []
    }, 1000);

  }
  $scope.uniqueIngredient = function (name) {
    var return_value = true;
    $scope.chosen_ingredients.forEach(function(ingredient) {
      if (name.toLowerCase() == ingredient.name.toLowerCase()) {
        return_value = false;
        return;
      }
    });
    $scope.excluded_ingredients.forEach(function(ingredient) {
      if (name.toLowerCase() == ingredient.name.toLowerCase()){
        return_value = false;
        return;
      }
    });
    return return_value;
  }

  $scope.reset = function(){
       $scope.match = "";
       $scope.query_result.length = 0;
  }
   $scope.insert = function(ingredient){
    var display =false;
    if (ingredient.toLowerCase().substr(0,4) == "not " && $scope.uniqueIngredient(ingredient.substr(4, ingredient.length))){ 
      dataService.addExcludedIngredient({name : ingredient.substr(4, ingredient.length).toLowerCase()});
      $scope.excluded_ingredients.push({name : ingredient.substr(4, ingredient.length).toLowerCase()}); 
      display = true;
    } else if (ingredient.toLowerCase().substr(0,4) != "not " && $scope.uniqueIngredient(ingredient)){
      dataService.addChosenIngredient({name : ingredient.toLowerCase()});
      $scope.chosen_ingredients.push({name : ingredient.toLowerCase()}); 
      display = true;
    } 
    if(display){
      $scope.displayRecipes();
      $scope.reset();
      }
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
    if (match.toLowerCase().substr(0,3) != "not" || (match.toLowerCase().substr(0,3) == "not" && match.length !=3 && match.length !=4)){ 
    //make API call if the first three letters != "not OR if they do == "not, then make the API call if there are more letters after the "not "
      $http.post(url, postObject).success(function(data) {
        $scope.query_result = data;
      });
    } else {
      $scope.query_result = [];
      //keep the query result empty if the first three letters are "not" and nothing else is after the "not"
    }
  }
  $scope.switchAndDisplay = function(name){
      var display =false;
       if ($scope.match.toLowerCase().substr(0,4) == "not " && $scope.uniqueIngredient(name.name)) {
          dataService.addExcludedIngredient(name);
          $scope.excluded_ingredients.push(name);
          display = true;
      } else if ($scope.match.toLowerCase().substr(0,4) != "not " && $scope.uniqueIngredient(name.name)) {
          dataService.addChosenIngredient(name);
         $scope.chosen_ingredients.push(name);
          display = true;
      }
      if(display){
        $scope.displayRecipes();
        $scope.reset();
      }
  }
  $scope.remove = function(container, index){
      container.splice(index,1);
      if (container == $scope.chosen_ingredients)
        dataService.removeIngredient("chosen_ingredients", index);
      else
        dataService.removeIngredient("excluded_ingredients", index);
      
      $scope.displayRecipes();
  }
    $scope.details = function(index){
      var postObject = {"recipeId" : $scope.dataArray[index].id};
        $http.post("/api/compositions/", postObject).success(function(data) {
         if (detailsService.setData(data)){
          $window.location.href = "/#/details/"+data.id; //redirecting the user to the details partial
      }
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
    });
  }
  $scope.load = function() {
    $scope.recipes = [];
    if (dataService.getExcludedIngredients().length > 0  || dataService.getChosenIngredients().length > 0){
      var url = '/api/compositions/withIngredients/'
      var allowedIngredients = new Array();
      dataService.getChosenIngredients().forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
          $scope.chosen_ingredients.push({name : ingredient.name});
      });
      var excludedIngredients = new Array();
      dataService.getExcludedIngredients().forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);
          $scope.excluded_ingredients.push({name : ingredient.name});
      });
      var postObject = {"ingredients" : allowedIngredients, "excluded" : excludedIngredients};
          $scope.dataArray = dataService.getRecipes();
          $scope.dataArray.forEach(function(recipe){
              $scope.recipes.push(recipe); 
        });

          $scope.topRecipes[0] = dataService.getTopRecipe0();

          $scope.topRecipes[1] = dataService.getTopRecipe1();
        };
         $scope.recipes.splice(0,2);
    }
  $scope.displayRecipes = function() {
    $scope.recipes = [];
    $scope.topRecipes = []
    dataService.clearRecipes();
    dataService.clearTopRecipes();
    if ($scope.chosen_ingredients.length) {
      var url = '/api/compositions/withIngredients/'
      var allowedIngredients = new Array();
      dataService.getChosenIngredients().forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
      });
      var excludedIngredients = new Array();
      dataService.getExcludedIngredients().forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);

      });
      var postObject = {"ingredients" : allowedIngredients, "excluded" : excludedIngredients};
        $http.post(url, postObject).success(function(data) {
          $scope.dataArray = data;
            data.forEach(function(recipe){
              $scope.recipes.push(recipe);
                dataService.addRecipe(recipe);
          });
        //reset the topRecipes array
        $scope.topRecipes = [];
        //add the top two recipes from the results to the topRecipes array
        $scope.topRecipes.push($scope.recipes[0]);
        $scope.topRecipes.push($scope.recipes[1]);
        //remove the top two recipes from the recipes array so we don't see them twice
        $scope.recipes.splice(0,2);
        //get the detailed recipe contents for our top recipes (need the larger image)
        $http.post("/api/compositions/", {"recipeId" : $scope.topRecipes[0].id}).success(function(data) {
          $scope.topRecipes[0] = data;
          dataService.addTopRecipe0(data);
        });
        $http.post("/api/compositions/", {"recipeId" : $scope.topRecipes[1].id}).success(function(data) {
          $scope.topRecipes[1] = data;
           dataService.addTopRecipe1(data);
        });
        
        });

      }
  }
  $scope.load();
}]);