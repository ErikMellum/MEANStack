var TheControllers = angular.module('TheControllers', ['recipeService']);

angular.module('TheControllers').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) { //the user pressed enter
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });

TheControllers.controller('SearchController', ['$scope','$http', 'detailsService', function($scope, $http, detailsService) {

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
    // detailsService.setName(recipe); //setting the name in the service so the DetailsController can use it later
    // console.log($scope.dataArray[index].id);
     $http.get("http://api.yummly.com/v1/api/recipe/"+$scope.dataArray[index].id+"?_app_id=af791dca&_app_key=f28b1240c0ab4435b41d6505f0278cfd").success(function(data) {
       detailsService.setName(data);
       console.log(data);
       console.log(data.name)
       console.log(data.totalTime)
       console.log(data.rating)
  });
    // http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
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

TheControllers.controller('DetailsController', ['$scope' ,'detailsService', function($scope, detailsService) {
     $scope.recipeName = detailsService.getName(); //call to service for the name of recipe
}]);

TheControllers.controller('AboutController', ['$scope','$http', function($scope, $http) {
}]);

TheControllers.controller('InputController', ['$scope','$http', function($scope, $http) {
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
      recipe = { "name":$scope.recipeName, "ingredients":array, "instruction":$scope.instructions, "user":$scope.userName};
      postObject = recipe;
      $http.post(url, postObject).success(function(data){
      });
}

}]);

TheControllers.controller('ApiScrapeController', ['$scope','$http', function($scope, $http) {
  $scope.test = "Test";
  $scope.currentIngredient;
  $http.get('/api/tmpIngredients').success(function(data) {
       $scope.tmpIngredients=data;
    });

  //http.get('/api/abstractIngredients')
  
  $scope.abstractIngredients=[];
  $scope.primitiveIngredients=[];
  $scope.tmpIds=[];

  //need
  $scope.getIngredient = function(ingredientName){
    var ingredient;
    $scope.tmpIngredients.forEach(function(element){
      if(element.name == ingredientName)
        $scope.setIngredient(element);
    });
    
  };
  $scope.clear= function() {

    $scope.currentIngredient = "";
    $scope.ingredientName = "";
  }
  $scope.setIngredient = function(ingredient){
    $scope.currentIngredient = ingredient;
    $scope.searchTmpIngredients = ingredient.name;
    $scope.ingredientName = ingredient.name;
  }
  $scope.delete= function(ingredient) {

    alert("Can't actually delete yet, API route not implemented!");
    $scope.currentIngredient = "";
    $scope.ingredientName = "";
    $scope.searchTmpIngredients = "";
    //http.delete('api/tmpIngredient/:id')
    //$http.get('/api/tmpIngredients').success(function(data) {
    //   $scope.tmpIngredients=data;
    //});
  }
  $scope.submitNewIngredient = function(){
    var primitiveIngredient;
    var abstractIngredient;
    var tmpIngredient;
    var params;
    $scope.currentIngredient.id = $scope.ingredientId;
    $scope.currentIngredient.name = $scope.ingredientName;
    $scope.currentIngredient.brand = $scope.ingredientBrand;
    $scope.currentIngredient.parent = $scope.ingredientParent;
    $scope.currentIngredient.unique = $scope.ingredientUnique;
    $scope.currentIngredient.processed = $scope.ingredientProcessed;

    $http.post('/api/tmpIngredients', $scope.currentIngredient).success(function(data) {
      alert("Successfully posted data, still not implemented however.");
    //   $scope.tmpIngredients=data;
    });
  };

}]);
