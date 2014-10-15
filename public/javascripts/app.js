var aboutController = angular.module('aboutController', []);

aboutController.controller('AboutController', ['$scope','$http', function($scope, $http) {
  $scope.test = "about";
}]);
angular.module('TheControllers', 
['searchController', 
'detailsController', 
'aboutController', 
'recipeController', 
'ingredientController']);

var detailsController = angular.module('detailsController', ['recipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe

  $scope.timeExists = function() {
    if ($scope.recipeData.totalTime)
      return true;
    return false;
  }
  $scope.ingredientsExist = function() {
    if ($scope.recipeData.ingredientLines)
      return true;
    return false;
  }
  $scope.load = function() {
    var recipe_id = $window.location.href;
    recipe_id =recipe_id.slice(recipe_id.lastIndexOf('/')+1, recipe_id.length);
    $http.post("/api/compositions/", {"recipeId" : recipe_id}).success(function(data) {
       detailsService.setData(data);
       $scope.recipeData = detailsService.getData();
       $scope.ingredients = detailsService.getIngredients();
     });
  }
  $scope.load(); //calling the load function so we can make the api call to populate the recipe data before the page loads
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }

}]);
var ingredientController = angular.module('ingredientController', ['ngEnter']);

ingredientController.controller('IngredientController', ['$scope','$http', function($scope, $http) {
  //for unit test
  $scope.test = "Test";
  //container for the temp ingredient used 
  $scope.currentIngredient; 
   //container for the parent ingredient used (we need the id to send to the server with our request)
  $scope.parentIngredient;
  //set up temp ingredients list
  $http.get('/api/ingredients/tmpIngredients').success(function(data) {
     $scope.tmpIngredients=data;
  });
  //set up abstract ingredients list
  $http.get('/api/ingredients/abstractIngredients').success(function(data) {
     $scope.abstractIngredients=data;
  });

  //need
  $scope.getIngredient = function(ingredientType, ingredientName){
    var ingredient;
    if(ingredientType == "tempIngredient")
    {
      $scope.tmpIngredients.forEach(function(element){
        if(element.name == ingredientName)
          $scope.setIngredient(ingredientType, element);
      });
    }
    else if(ingredientType == "abstractIngredient")
    {
      $scope.abstractIngredients.forEach(function(element){
        if(element.name == ingredientName)
          $scope.setIngredient(ingredientType, element);
      });
    }
  };

  $scope.clear= function() {

    $scope.currentIngredient = "";
    $scope.ingredientName = "";
  }
  $scope.setIngredient = function(ingredientType, ingredient){
    if(ingredientType == "tempIngredient")
    {
      $scope.currentIngredient = ingredient;
      $scope.searchTmpIngredients = ingredient.name;
      $scope.ingredientName = ingredient.name; 
    }
    else if(ingredientType == "abstractIngredient")
    {
      $scope.ingredientParent = ingredient.name;
      $scope.ingredientParentId = ingredient._id;
    }

  }
  $scope.delete= function(ingredientType, ingredient) {
    if(ingredientType == "tempIngredient")
    {
      alert("Can't actually delete yet, API route not implemented!");
      $scope.currentIngredient = "";
      $scope.ingredientName = "";
      $scope.searchTmpIngredients = "";
      var url = 'api/ingredients/tmpIngredient/:' + $scope.ingredientId;
      http.delete(url).success(function(data) {
      //   $scope.tmpIngredients=data;
      });
    }
    else if(ingredientType == "abstractIngredient")
    {
      var url = 'api/ingredients/abstractIngredient/:' + $scope.parentIngredient.id;
      http.delete(url).success(function(data) {
      //   $scope.tmpIngredients=data;
      });
    }
  }
  $scope.submitNewIngredient = function(){
    var primitiveIngredient;
    var abstractIngredient;
    var tmpIngredient;
    var params;
    $scope.currentIngredient.name = $scope.ingredientName;
    $scope.currentIngredient.brand = $scope.ingredientBrand;
    $scope.currentIngredient.parent = $scope.ingredientParentId;
    $scope.currentIngredient.unique = $scope.ingredientUnique;
    $scope.currentIngredient.processed = $scope.ingredientProcessed;

    $http.post('/api/ingredients/tmpIngredients', $scope.currentIngredient).success(function(data) {
     // alert("Successfully posted data, still not implemented however.");
        $scope.abstractIngredients=data.abstracts;
        $scope.tmpIngredients=data.temps;

    });

    var url= '/api/ingredients/tmpIngredients/:' + $scope.ingredientName;
    $http.delete(url, $scope.currentIngredient).success(function(data) {
     // alert("Successfully posted data, still not implemented however.");
       $scope.tmpIngredients=data;
    });
  };

}]);
var recipeController = angular.module('recipeController', []);

recipeController.controller('RecipeController', ['$scope','$http', function($scope, $http) {

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
      var url = '/api/compositions/new/';
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
var reviewsController = angular.module('reviewsController', []);

aboutController.controller('AboutController', ['$scope','$http', function($scope, $http) {
  $scope.test = "test"
}]);
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
        $http.post("/api/compositions/", postObject).success(function(data) {
         if (detailsService.setData(data)){
          $window.location.href = "/#/details/"+data.id; //redirecting the user to the details partial
      }
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
    });
  }
  $scope.displayRecipes = function() {
    $scope.recipes = [];
    if ($scope.chosen_ingredients.length) {
      var url = '/api/compositions/withIngredients/'
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
var directives = angular.module('TheDirectives', ['ngEnter']);

var ngEnter = angular.module('ngEnter', []);

ngEnter.directive('ngEnter', function() {
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
var myApp = angular.module('myApp', ['ngRoute','TheControllers']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/search', {
    templateUrl: 'search',
    controller: 'SearchController'
  }).
    when('/about', {
    templateUrl: 'about',
    controller: 'AboutController'
  }).
    when('/create', {
    templateUrl: 'create',
    controller: 'RecipeController'
  }).
    when('/details/:name', {
    templateUrl: 'details/:name',
    controller: 'DetailsController',
    // resolve: {
    //         recipeData: function(detailsService){
    //           console.log("router");
    //             return detailsService.getData();
    //     }
    //   }
  }).
    when('/tmpIngredient', {
    templateUrl: 'tmpIngredient',
    controller: 'IngredientController'
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);


var recipeService = angular.module('recipeService', []);

recipeService.service('detailsService', function(){
  var recipeData= "";
  var ingredients = []; 

  var setData = function(data) {
      ingredients = [];
      for (var i =0; i < data.ingredientLines.length; i ++){
        if (data.ingredientLines[i] != data.ingredientLines[i+1])
          ingredients.push(data.ingredientLines[i]);
      }
      recipeData = data;
      return true;
  }
  var getIngredients = function(){
    return ingredients;
  }

  var getData = function(){
      return recipeData;
  }

  return {
    setData: setData,
    getData: getData,
    getIngredients: getIngredients
  };      
});
