var TheControllers = angular.module('TheControllers', []);

TheControllers.controller('RecipeController', ['$scope', function($scope, $http) {
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
  }
]

// $scope.chosen_ingredients=[]
$scope.chosen_ingredients=[
  {
    name:"Cake"
  }
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

