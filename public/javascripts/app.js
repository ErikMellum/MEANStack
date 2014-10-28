var aboutController = angular.module('aboutController', []);

aboutController.controller('AboutController', ['$scope','$http', function($scope, $http) {
  $scope.test = "about";
}]);
angular.module('TheControllers', 
[
  'searchController', 
  'detailsController', 
  'aboutController', 
  'recipeController', 
  'ingredientController',
  'mainController'
]);

var detailsController = angular.module('detailsController', ['recipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe
  $scope.text = "Test";
  $scope.url = "";
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
       $scope.url = data.source.sourceRecipeUrl;
       $http.get(data.source.sourceRecipeUrl).success(function(data1) {
          $scope.text = data1;
          
        });
     });
  }
  $scope.load(); //calling the load function so we can make the api call to populate the recipe data before the page loads
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }

}]);
var ingredientController = angular.module('ingredientController', ['ngEnter', 'ingredientService']);

ingredientController.controller('IngredientController', ['$scope','$http', 'TmpIngredient', 'AbstractIngredient', 'PrimitiveIngredient', 
  function($scope, $http, TmpIngredient, AbstractIngredient, PrimitiveIngredient) {
  //for unit test
  $scope.test = "Test";
  //container for the temp ingredient used 
  $scope.currentIngredient = {name : "", parent : "", parentName : ""}; 
  //set up temp ingredients list
  $scope.tmpIngredients = TmpIngredient.find();
  //set up abstract ingredients list
  $scope.abstractIngredients = AbstractIngredient.find();

  $scope.primitiveIngredients = PrimitiveIngredient.find();



  //clear will set the currentIngredient to be nothing, and the ingredient name
  //field to be nothing
  $scope.clear= function() {
    $scope.ingredientName = "";
    $scope.currentIngredient = "";
  }

  $scope.setIngredient = function(ingredient){
    $scope.currentIngredient = ingredient;
    $scope.ingredientName = ingredient.name;
  }

  $scope.setIngredientParent = function(ingredient){
    $scope.currentIngredient.parentName = ingredient.name;
    $scope.currentIngredient.parent = ingredient._id;
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
  // This will attempt to locate an abstract ingredient using the parent name on the
  // current ingredient. It will then set the currentIngredient's parent (which is an id)
  $scope.locateParentIdByName = function(){
    if($scope.currentIngredient.parentName != "" && $scope.currentIngredient.parent == "")
    {
      $scope.abstractIngredients.forEach(function (element) {
        if(element.name == $scope.currentIngredient.parentName)
          $scope.currentIngredient.parent = element._id;
      });
    }
  }

  $scope.clearParent = function() {
    $scope.currentIngredient.parentName = "";
    $scope.currentIngredient.parent = "";
  }
  $scope.submitNewIngredient = function(){
    var primitiveIngredient;
    var abstractIngredient;
    var tmpIngredient;
    var params;
    $scope.locateParentIdByName();
    // true means that you are creating a primitive, false an abstract
    if($scope.currentIngredient.unique == true)
    {
      $http.post('/api/ingredients/primitives', $scope.currentIngredient).success(function(data) {
        $scope.primitiveIngredients = data.primitives;
        $scope.tmpIngredients = TmpIngredient.find();
      });
    }
    else
    {
      $http.post('/api/ingredients/abstracts', $scope.currentIngredient).success(function(data) {
        alert("Successfully created " + $scope.currentIngredient.name);
        $scope.currentIngredient = "";
        $scope.abstractIngredients = data;
        $scope.tmpIngredients = TmpIngredient.find();
      });

    }
    

    // var url= '/api/ingredients/tmpIngredients/:' + $scope.ingredientName;
    // $http.delete(url, $scope.currentIngredient).success(function(data) {
    //  // alert("Successfully posted data, still not implemented however.");
    //    $scope.tmpIngredients=data;
    // });
  };

}]);
var mainController = angular.module('mainController', []);

mainController.controller('MainController', ['$scope','$http', function($scope, $http) {
   $scope.links = ['Search', 'About', 'Create'];
   $scope.select= function(item) {
     $scope.selected = item; 
   };

   $scope.isActive = function(item) {
     return $scope.selected === item;
   };
}]);
var recipeController = angular.module('recipeController', ['ngEnter', 'ingredientService']);

recipeController.controller('RecipeController', ['$scope','$http', 'Composition', 'PrimitiveIngredient', 'AbstractIngredient', 'TmpIngredient',
  function($scope, $http, Composition, PrimitiveIngredient, AbstractIngredient, TmpIngredient) {
$scope.combinedIngredients = [];
// needs to be done in a callback because find is actually a promise, and completely asynchronous
Composition.find(function(compResult){
  $scope.combinedIngredients = $scope.combinedIngredients.concat(compResult);
});

PrimitiveIngredient.find(function(primResult){
  $scope.combinedIngredients = $scope.combinedIngredients.concat(primResult);
});

AbstractIngredient.find(function(abstResult){
  $scope.combinedIngredients = $scope.combinedIngredients.concat(abstResult);
});

$scope.test = "Test";
$scope.count = '0';
$scope.icount = '0';
$scope.ingredients = [];
$scope.currentIngredient = "";
$scope.steps = [];
$scope.currentStep = "";
$scope.userName = "guest";
$scope.recipeName = "";
$scope.maxIngredients = 100; 
$scope.inputRecipe = function() {

var url = '/api/compositions/new/';
console.log($scope.userName);
console.log($scope.recipeName);
console.log($scope.ingredients);
console.log($scope.steps);
recipe = { "name":$scope.recipeName, "ingredients": $scope.ingredients, "instruction":$scope.steps, "user":$scope.userName};
postObject = recipe;
$http.post(url, postObject).success(function(data){
});
}

$scope.addIngredient = function() {
    if($scope.currentIngredient != "")
    {
      var newIngredient = $scope.currentIngredient;
      $scope.ingredients.push(newIngredient);
      $scope.currentIngredient = ""
    }
    else
      alert("Nothing to add!")
 }

 $scope.removeIngredient = function(index) {
    if(index == 0)
      $scope.ingredients.splice(index, 1)
    else
      $scope.ingredients.splice(index, index);
 }

 $scope.addStep = function() {
    if($scope.currentStep != "")
    {
      var newStep = $scope.currentStep;
      $scope.steps.push(newStep);
      $scope.currentStep = ""
    }
    else
      alert("Nothing to add!")
 }

 $scope.removeStep = function(index) {
    if(index == 0)
      $scope.steps.splice(index, 1)
    else
      $scope.steps.splice(index, index);
 }

$scope.setIngredient = function(ingredient){
      $scope.currentIngredient = ingredient;
  }

 }]);

var reviewsController = angular.module('reviewsController', []);

aboutController.controller('AboutController', ['$scope','$http', function($scope, $http) {
  $scope.test = "test"
}]);
var searchController = angular.module('searchController', ['recipeService', 'ngAnimate']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', function($scope, $http, $window, detailsService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []  
  $scope.excluded_ingredients = []
  $scope.match="";
  $scope.topRecipes = []


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
              $scope.recipes.push(recipe);
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
        });
        $http.post("/api/compositions/", {"recipeId" : $scope.topRecipes[1].id}).success(function(data) {
          $scope.topRecipes[1] = data;
        });
        
        });

        

      }
  }
}]);
var directives = angular.module('TheDirectives', ['ngEnter']);

var draggable = angular.module('draggable', []);

draggable.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});
var droppable = angular.module('droppable', []);

droppable.directive('droppable', function() {
    return {
        scope: {
          drop: '&', // parent
          bin: '=' // bi-directional scope
        },
        link: function(scope, element) {
            // again we need the native object
          var el = element[0];
          el.addEventListener('dragover', function(e) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              if (e.preventDefault) e.preventDefault();
              this.classList.add('over');
              return false;
            },
            false
          );
          el.addEventListener(
              'dragenter',
              function(e) {
                  this.classList.add('over');
                  return false;
              },
              false
          );
          el.addEventListener(
              'dragleave',
              function(e) {
                  this.classList.remove('over');
                  return false;
              },
              false
          );
          el.addEventListener(
              'drop',
              function(e) {
                  var binId = this.id;
                  var item = document.getElementById(e.dataTransfer.getData('Text'));
                  this.appendChild(item);
                  // call the passed drop function
                  scope.$apply(function(scope) {
                      var fn = scope.drop();
                      if ('undefined' !== typeof fn) {
                        fn(item.id, binId);
                      }
                  });
              },
              false
          );
        }
    }
});
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


var ingredientService = angular.module('ingredientService', ['ngResource']);

ingredientService.factory('PrimitiveIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/primitiveIngredients', {}, {
      find: {method:'GET', params:{ingredientId: 'primitiveIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'primitiveIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
ingredientService.factory('TmpIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/tmpIngredients', {}, {
      find: {method:'GET', params:{ingredientId:'tmpIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'tmpIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
ingredientService.factory('AbstractIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/abstractIngredients', {}, {
      find: {method:'GET', params:{ingredientId:'abstractIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'abstractIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
ingredientService.factory('Composition', ['$resource',
  function($resource){
    return $resource('api/ingredients/compositions', {}, {
      find: {method:'GET', params:{ingredientId: 'compositions'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'primitiveIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
var recipeService = angular.module('recipeService', ['ngResource', 'ingredientService']);

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
