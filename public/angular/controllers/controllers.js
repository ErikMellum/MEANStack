var TheControllers = angular.module('TheControllers', []);

TheControllers.controller('RecipeController', ['$scope', '$http', function($scope, $http) {
 $scope.query_result = [
  { 
    name: "steak"
  },
  { 
    name: "eggs"
  },
  {
    name: "buttermilk"
  },
  {
    name: "flour"
  },
  {
    name:"vegetable oil"
  },
  {
<<<<<<< HEAD
    name:"garlic"
=======
    name:"Cake",
>>>>>>> 0d07961547d88acfd26d76936edb8263ccbead4c
  },
  {
    name:"cognac"
  },
  {
    name:"cumin seed"
  },
  {
    name:"pizza"
  }
]
$scope.chosen_ingredients=[]
$scope.recipes=[]

<<<<<<< HEAD
$scope.switchAndDisplay = function(name, container, index){
=======
// $scope.chosen_ingredients=[]
$scope.chosen_ingredients=[
  {
    name:"bacon"
  }
]
$scope.recipes=[
]

$scope.removeIngredientAndAdd = function(name, container, index){
>>>>>>> 0d07961547d88acfd26d76936edb8263ccbead4c
    container.splice(index,1);
     $scope.chosen_ingredients.push(name);
     $scope.recipes.length = 0;
     $scope.displayRecipes();
}
$scope.remove = function(container, index){
    container.splice(index,1);
    //remove all recipes because we have no ingredients chosen or we have removen an ingredient and we need to empty the recipe array to render a new recipe array later
   if($scope.chosen_ingredients.length == 0 || container != $scope.recipes) 
     $scope.recipes.length = 0;

   //if we arent removing a recipe, display the new recipe list
   if (container != $scope.recipes) { 
     $scope.displayRecipes();
   }
}
<<<<<<< HEAD
$scope.removeAll = function(container){
    var index = 0;
    container.forEach(function(element){
      container.splice(index,1);
    });
}
$scope.displayRecipes = function() {
  //if there are chosen ingredients present, execute the api call
  if ($scope.chosen_ingredients.length) {
      var http = 'http://api.yummly.com/v1/api/recipes?_app_id=885488fb&_app_key=453ae9fd4d29a72598c6368d9734d3fa'
      $scope.chosen_ingredients.forEach(function(element){
        http += '&allowedIngredient[]='+element.name
      });
      $http.get(http, {'dataType': 'jsonp'})
        .success(function(data) {
          data.matches.forEach(function(recipe){
            $scope.recipes.push({name:recipe.recipeName});
        });
          console.log(data);
      })
      .error(function(data) {
        console.log('Error');
      });
    }
  }
=======
//app id 885488fb
//app key 453ae9fd4d29a72598c6368d9734d3fa
//$http.defaults.headers.common["X-Custom-Header"] = "Angular.js"
//need to use factory http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/
//stack overflow answer to api yummly call http://stackoverflow.com/questions/13464619/how-do-i-interpret-json-if-jquery-thinks-it-is-receiving-a-jsonp-request
$scope.displayRecipes = function() {
//    http://api.yummly.com/v1/api/recipes?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY&q=onion+soup
// &allowedIngredient[]=garlic&allowedIngredient[]=cognac
 
  var searchParams = "";
  var i;
   
  for(i = 0; i < $scope.chosen_ingredients.length; i++) {
    
    searchParams += "&allowedIngredient[]=" + $scope.chosen_ingredients[i].name;
  }
  
  var url = "http://api.yummly.com/v1/api/recipes?_app_id=885488fb&_app_key=453ae9fd4d29a72598c6368d9734d3fa" + searchParams;
  
  $http.get(url).success(function(data) {
    
    for(i = 0; i < 10; i++)
    {
      $scope.recipes.push(data.matches[i].recipeName);
    }
    
  }).error(function(data) {
  log('Error: ' + data);
  });
}
//   ;
>>>>>>> 0d07961547d88acfd26d76936edb8263ccbead4c
}]);

TheControllers.controller('LandingController', ['$scope', function($scope) {
  $scope.name = "Tester";
  $scope.testFunction = function() {
    $scope.greeting = "Hello " + $scope.name;
  }
}]);

TheControllers.controller('AboutController', ['$scope', function($scope, $http) {
  $scope.names=["Name 1, Name 2, Name3"];
}]);