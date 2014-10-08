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

TheControllers.controller('SearchController', ['$scope','$http', '$window','detailsService', function($scope, $http, $window, detailsService) {

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

TheControllers.controller('DetailsController', ['$scope' ,'detailsService', function($scope, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe

  $scope.recipeTimeExists = function() {
    if ($scope.recipeData.totalTime)
      return true;
    return false;
  }
  $scope.recipeIngredientsExist = function() {
    if ($scope.recipeData.ingredientLines)
      return true;
    return false;
  }
    $scope.recipeSourceExists = function() {
    if ($scope.recipeData.source.sourceRecipeUrl)
      return true;
    return false;
  }
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
  //for unit test
  $scope.test = "Test";
  //container for the temp ingredient used 
  $scope.currentIngredient; 
   //container for the parent ingredient used (we need the id to send to the server with our request)
  $scope.parentIngredient;
  //set up temp ingredients list
  $http.get('/api/tmpIngredients').success(function(data) {
     $scope.tmpIngredients=data;
  });
  //set up abstract ingredients list
  $http.get('/api/abstractIngredients').success(function(data) {
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
      var url = 'api/tmpIngredient/:' + $scope.ingredientId;
      http.delete(url).success(function(data) {
      //   $scope.tmpIngredients=data;
      });
    }
    else if(ingredientType == "abstractIngredient")
    {
      var url = 'api/abstractIngredient/:' + $scope.parentIngredient.id;
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

    $http.post('/api/tmpIngredients', $scope.currentIngredient).success(function(data) {
     // alert("Successfully posted data, still not implemented however.");
        $scope.abstractIngredients=data.abstracts;
        $scope.tmpIngredients=data.temps;

    });

    var url= '/api/tmpIngredients/:' + $scope.ingredientName;
    $http.delete(url, $scope.currentIngredient).success(function(data) {
     // alert("Successfully posted data, still not implemented however.");
       $scope.tmpIngredients=data;
    });
  };

}]);
