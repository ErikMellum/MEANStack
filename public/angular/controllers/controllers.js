var TheControllers = angular.module('TheControllers', []);

TheControllers.controller('RecipeController', ['$scope', '$http', function($scope, $http) {
 $scope.query_result = [
  {
    name:"Pizza",
  },
  {
    name:"Bacon",
  },
  {
    name:"Beef",
  },
  {
    name:"Broccili",
  },
  {
    name:"Pork",
  },
  {
    name:"Pizza",
  },
  {
    name:"Cake",
  },
  {
    name:"Beef",
  },
  {
    name:"Broccili",
  },
  {
    name:"Pork",
  }
]

// $scope.chosen_ingredients=[]
$scope.chosen_ingredients=[
  {
    name:"bacon"
  }
]
$scope.recipes=[
]

$scope.removeIngredientAndAdd = function(name, container, index){
    container.splice(index,1);
    // $scope.push($scope.chosen_ingredients[index]);
    // console.log("asdasd");
     $scope.chosen_ingredients.push(name);
     // console.log($scope.chosen_ingredients);
     // console.log("Asdasd");
}
$scope.removeIngredient = function(container, index){
    container.splice(index,1);
}
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