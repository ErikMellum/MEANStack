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

var detailsController = angular.module('detailsController', ['theRecipeService']);
detailsController.controller('DetailsController', ['$scope' , '$http', '$window', 'detailsService', function($scope, $http, $window, detailsService) {
  $scope.recipeData = detailsService.getData(); //call to service for the name of recipe
  $scope.text = "Test";
  $scope.url = "";
  $scope.recipe = []
  $scope.timeExists = function() {
    if ($scope.recipeData.totalTime)
      return true;
    return false;
  }

  $scope.isEnhanced = detailsService.isEnhanced;
  $scope.ingredientsExist = function() {
    if (detailsService.getIngredients())
      return true;
    return false;
  }
  $scope.load = function() {
    var recipe_id = $window.location.href;
    recipe_id =recipe_id.slice(recipe_id.lastIndexOf('/')+1, recipe_id.length);
    // this is so bad I want to puke
    // if this is still here at the end of the semester, someone send an angry email to : Jayd_WTF_Are_You_Doing@saurdo.com
    var type = recipe_id[0] == "$" ? "Composition" : "yummly";
    recipe_id = type == "yummly" ? recipe_id.slice(recipe_id.lastIndexOf('/')+1, recipe_id.length) : recipe_id.slice(recipe_id.lastIndexOf('/')+2, recipe_id.length); 
    $http.post("/api/compositions/", {"recipeId" : recipe_id, "type": type}).success(function(data) {
      detailsService.setData(data);
      $scope.recipeData = detailsService.getData();
      $scope.ingredients = detailsService.getIngredients();
      $scope.recipe.push({
        name: $scope.recipeData.name,
        instructions: $scope.recipeData.instruction,
        img: $scope.recipeData.img
      });
    });
  };

  $scope.getComposition = function(index, comp){
    $scope.ingredients.splice(index, 1);
    var recipe_id = comp._id;
    var type = comp.type;
    $http.post("/api/compositions/", {"recipeId" : recipe_id, "type": type}).success(function(data) {
      $scope.ingredients = $scope.ingredients.concat(data.recipe);
      $scope.recipe.push({
        name: data.name,
        instructions: data.instruction,
        img: "http://i.imgur.com/Cey1Ud1.jpg"
      });
    });
  }
  $scope.yieldExists = function() {
    if ($scope.recipeData.yield)
      return true;
    return false;
  }
  $scope.load(); //calling the load function so we can make the api call to populate the recipe data before the page loads

}]);
/**
 * ingredientController is included in the controllers.js
 */
var ingredientController = angular.module('ingredientController', ['ngEnter', 'theIngredientService']);
/**
 * ingredientController is used to do CRUD with ingredient models, as well as prepare the create ingredient page data for the user
 */
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
  //set up primitive ingredients list
  $scope.primitiveIngredients = PrimitiveIngredient.find();


  /**
    clear will set the currentIngredient to be nothing, and the ingredient name
    field to be nothing
  **/
  $scope.clear= function() {
    $scope.ingredientName = "";
    $scope.currentIngredient = "";
  }
  /**
   * setIngredient sets the current ingredient and the ingredient name field
   * to be that of the passed in ingredient
   * @param {Ingredient} ingredient
   */
  $scope.setIngredient = function(ingredient){
    $scope.currentIngredient = ingredient;
    $scope.ingredientName = ingredient.name;
  }
  /**
   * setIngredientParent is used to set the parentName and parent (id) of the 
   * currentIngredient being added
   * @param {Ingredient} ingredient
   */
  $scope.setIngredientParent = function(ingredient){
    $scope.currentIngredient.parentName = ingredient.name;
    $scope.currentIngredient.parent = ingredient._id;
  }

  /**
   * delete is called after you submit a new ingredient - it removes the temporary
   * ingredient that was used as seed data for the new abstract / primitive
   * it also updates the tmpIngredientList to not include that ingredient
   * @param  {String} ingredientType - 'tempIngredient' or 'abstractIngredient'
   * @param  {Ingredient} ingredient
   */
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
  /**
  * This will attempt to locate an abstract ingredient using the parent name on the
  * current ingredient. It will then set the currentIngredient's parent (which is an id)
  **/
  $scope.locateParentIdByName = function(){
    if($scope.currentIngredient.parentName != "" && $scope.currentIngredient.parent == "")
    {
      $scope.abstractIngredients.forEach(function (element) {
        if(element.name == $scope.currentIngredient.parentName)
          $scope.currentIngredient.parent = element._id;
      });
    }
  }
  /**
  * This will clear the parent name and parent (id) fields on the currentIngredient
  **/
  $scope.clearParent = function() {
    $scope.currentIngredient.parentName = "";
    $scope.currentIngredient.parent = "";
  }

  /**
   * submitNewIngredient will look at the unique field and if true it will create
   * a primitive ingredient, and if false, it will create an abstractIngredient.
   * Either ingredient will be created using the currentIngredient data and 
   * upon the successful creation the of primitives / abstracts will be updated
   * to include the newly added ingredient.
   * @return {[type]}
   */
  $scope.submitNewIngredient = function(){
    var primitiveIngredient;
    var abstractIngredient;
    var tmpIngredient;
    var params;
    $scope.currentIngredient.name = $scope.ingredientName;
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
var recipeController = angular.module('recipeController', ['ngEnter', 'theIngredientService']);

recipeController.controller('RecipeController', ['$scope','$http', 'Composition', 'PrimitiveIngredient', 'AbstractIngredient', 'TmpIngredient',
  function($scope, $http, Composition, PrimitiveIngredient, AbstractIngredient, TmpIngredient) {
$scope.combinedIngredients = [];
// needs to be done in a callback because find is actually a promise, and completely asynchronous
Composition.find(function(compResult){
  compResult = compResult.map(function(comp){ comp.type = "composition"; return comp;});
  $scope.combinedIngredients = $scope.combinedIngredients.concat(compResult);
  console.log($scope.combinedIngredients[0]);
});

PrimitiveIngredient.find(function(primResult){
  primResult = primResult.map(function(prim){ prim.type = "primitive"; return prim;});
  $scope.combinedIngredients = $scope.combinedIngredients.concat(primResult);
});

AbstractIngredient.find(function(abstResult){
  abstResult = abstResult.map(function(abst){ abst.type = "abstract"; return abst;});
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
  alert("Created Successfully!");
  $scope.ingredients = [];
  $scope.currentIngredient = "";
  $scope.steps = [];
  $scope.currentStep = "";
  $scope.recipeDescription = "";
  $scope.recipeName = "";
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
var searchController = angular.module('searchController', ['ngEnter', 'theRecipeService', 'theDataService', 'ngAnimate', 'ngConfirm']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', 'dataService', function($scope, $http, $window, detailsService, dataService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []  
  $scope.excluded_ingredients = []
  $scope.match="";
  $scope.topRecipes = [];
  $scope.pageTitle = "Add Ingredients";
  $scope.keywords ="";
  $scope.placeholder = "Search Ingredients...To exclude, type 'not' or 'no' followed by ingredient name";
  $scope.placeholderAlt = "Find ingredients you want to be in the recipe";

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
      $scope.topRecipes = [];

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
    if($scope.pageTitle == "Search Recipes"){
      $scope.keywords=ingredient;
      $scope.displayRecipes();
    }
    else{
      var display =false;
      if ((ingredient.toLowerCase().substr(0,4) == "not " ) || 
      (ingredient.toLowerCase().substr(0,3) == "no ")
      && $scope.uniqueIngredient(ingredient.substr(3, ingredient.length).trim())){ 
        dataService.addExcludedIngredient({name : ingredient.substr(3, ingredient.length).trim().toLowerCase()});
        $scope.excluded_ingredients.push({name : ingredient.substr(3, ingredient.length).trim().toLowerCase()}); 
        display = true;
      } else if ((ingredient.toLowerCase().substr(0,4) != "not ") && 
      (ingredient.toLowerCase().substr(0,3) != "no ") && $scope.uniqueIngredient(ingredient)){
        dataService.addChosenIngredient({name : ingredient.toLowerCase()});
        $scope.chosen_ingredients.push({name : ingredient.toLowerCase()}); 
        display = true;
      } 
      if(display){
        $scope.displayRecipes();
        $scope.reset();
      }
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
    
    if($scope.pageTitle == "Search Recipes"){
      $scope.keywords=match;
      displayRecipes();
    }
    else{
      var postObject = {};
    var url = '/api/ingredients/';
      if ((match.toLowerCase().substr(0,3) == "not" || match.toLowerCase().substr(0,2) == "no") 
        && match.length > 4){
        postObject = {"ingredient" : match.substr(4, match.length)};
      } 
      else {
        postObject = {"ingredient" : match};
      }
      $http.post(url, postObject).success(function(data) {
        $scope.query_result = data;
      });
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
      var theRecipe, postObject;
      theRecipe = $scope.dataArray[index];
      postObject = {};
      // if _id exists, it's from our db
      if(theRecipe._id){
        postObject.recipeId = theRecipe._id;
        postObject.type = theRecipe.__t;
      }
      else{
        postObject.recipeId = theRecipe.id;
        postObject.type = "yummly";
      }
      $http.post("/api/compositions/", postObject).success(function(data) {
       if (detailsService.setData(data)){
          var id = data.__t ? "$"+data._id : data.id;
          $window.location.href = "/#/details/"+id; //redirecting the user to the details partial
        }
      });
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
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
      var postObject = {"ingredients" : allowedIngredients, "excluded" : excludedIngredients, "meal" : $scope.meal};
          $scope.dataArray = dataService.getRecipes();
          $scope.dataArray.forEach(function(recipe){
              $scope.recipes.push(recipe); 
        });

          $scope.topRecipes[0] = dataService.getTopRecipe0();

          $scope.topRecipes[1] = dataService.getTopRecipe1();
        };
        $scope.meal = dataService.getMeal();
        $scope.cuisine = dataService.getCuisine();
        $scope.diet = dataService.getDiet();
        $scope.keywords = dataService.getKeywords();
         $scope.recipes.splice(0,2);
    }
    $scope.changeTitle= function() {
      if($scope.pageTitle == "Add Ingredients"){
        $scope.pageTitle = "Search Recipes";
        $scope.placeholder = "Enter in the name or keyword of your recipe to search";
        $scope.placeholderAlt = "Find recipes by entering in keywords";
      }
      else {
        $scope.pageTitle = "Add Ingredients";
        $scope.placeholder = "Search Ingredients...To exclude, type 'not' or 'no' followed by ingredient name";
        $scope.placeholderAlt = "Find ingredients you want to be in the recipe";
      }
      
    }
  $scope.displayRecipes = function() {
    $scope.recipes = [];
    $scope.topRecipes = []
    dataService.clearRecipes();
    dataService.clearTopRecipes();
    if ($scope.chosen_ingredients.length || $scope.keywords != "") {
      var url = '/api/compositions/withIngredients/'
      var allowedIngredients = new Array();
      dataService.getChosenIngredients().forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
      });
      var excludedIngredients = new Array();
      dataService.getExcludedIngredients().forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);

      });
      dataService.addMeal($scope.meal);
      dataService.addCuisine($scope.cuisine);
      dataService.addDiet($scope.diet);
      dataService.addKeywords($scope.keywords);
      var postObject = {
        "ingredients" : allowedIngredients, 
        "excluded" : excludedIngredients, 
        "meal" : $scope.meal, 
        "diet" : $scope.diet, 
        "cuisine" : $scope.cuisine,
        "keywords" : $scope.keywords
      };
      $http.post(url, postObject).success(function(data) {
        $scope.dataArray = data;
          data.forEach(function(recipe){
            $scope.recipes.push(recipe);
              dataService.addRecipe(recipe);
        });
          
        //reset the topRecipes array
        $scope.topRecipes = [];
        var r1, r2;
        r1 = $scope.recipes[0];
        r2 = $scope.recipes[1];
        //add the top two recipes from the results to the topRecipes array
        $scope.topRecipes.push(r1);
        $scope.topRecipes.push(r2);
        //remove the top two recipes from the recipes array so we don't see them twice
        $scope.recipes.splice(0,2);
        //get the detailed recipe contents for our top recipes (need the larger image)
        var postObject1, postObject2;

        // construct postObjects
        postObject1 = r1 && r1._id ? {"recipeId" : r1._id, "type": r1.__t} : {"recipeId" : r1.id, "type": "yummly"};
        postObject2 = r2 && r2._id ? {"recipeId" : r2._id, "type": r2.__t} : {"recipeId" : r2.id, "type": "yummly"};
        $http.post("/api/compositions/", postObject1).success(function(data) {
          $scope.topRecipes[0] = data;
          dataService.addTopRecipe0(data);
        });
        $http.post("/api/compositions/", postObject2).success(function(data) {
          $scope.topRecipes[1] = data;
           dataService.addTopRecipe1(data);
        });  
      });
    }
  }
  $scope.load();
}]);
var directives = angular.module('TheDirectives', ['ngEnter', 'ngConfirm', 'draggable', 'droppable', 'editable']);

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
var editable = angular.module('editable', []);

editable.directive('editable', function() {
    var editTemplate = '<input style="cursor: text" ng-model="editable" ng-dblclick="switchToShow()" ng-show="editingMode">';
    var showTemplate = '<span style="cursor: text" ng-hide="editingMode" ng-dblclick="switchToEdit()" ng-bind="editable"></span>';
    return{
        restrict: 'E',
        compile: function (tElement, tAttrs, transclude){
            tElement.html(editTemplate);
            tElement.append(showTemplate);
            return function(scope, element, attrs) {
                scope.editingMode = false;
                scope.editable = scope.data;
                scope.switchToShow = function () {
                    scope.editingMode = false;
                }
                scope.switchToEdit = function () {
                    scope.editingMode = true;
                }
            }
        }
    }
});
var ngConfirm = angular.module('ngConfirm', []);
ngConfirm.directive('ngConfirm', function () {
  return {
    priority: -1,
    terminal: true,
    link: {
      pre:function (scope, element, attr) {
        var msg = attr.ngConfirm || "Are you sure?";
        element.bind('click',function () {
          if ( window.confirm(msg) ) {
            scope.$eval(attr.ngClick);
          }
        });
      }
  }
  };
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
var myApp = angular.module('myApp', ['ngRoute','TheControllers', 'TheDirectives']);

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


var theDataService = angular.module('theDataService', ['ngResource', 'theIngredientService']);


theDataService.service('dataService', function(){
	//need to add ability to delete a specific ingredient from the service
  var chosen_ingredients=[];
  var recipes=[];
  var excluded_ingredients = [];
  var topRecipe0 =[];
  var topRecipe1 = [];
  var meal, cuisine, diet, keywords;

  var addTopRecipe0 = function (data) {
    topRecipe0.push(data);
  }
  var addTopRecipe1 = function (data) {
    topRecipe1.push(data);
  }
  var addRecipe = function(data){
    recipes.push(data);
  }
  var addDiet = function(data){
    diet = data;
  }
  var addMeal = function(data){
    meal = data;
  }
  var addCuisine = function(data){
    cuisine = data;
  }
  var addKeywords = function(data){
    keywords = data;
  }
  var getKeywords = function () {
    return keywords;
  }
  var removeIngredient = function (container, index) {
    if (container == "chosen_ingredients")
       chosen_ingredients.splice(index,1);
    else
       excluded_ingredients.splice(index,1);
  }

  var addChosenIngredient = function(name) {
    chosen_ingredients.push(name); 
  }
   var addExcludedIngredient = function(name) {
   	excluded_ingredients.push(name); 
  }
  var getRecipes = function(){
  	  return recipes;	
  }
  var getChosenIngredients = function(){
      return chosen_ingredients;
  }

  var getExcludedIngredients = function(){
      return excluded_ingredients;
  }
  var getTopRecipe0 = function () {
    return topRecipe0[0]
  }

  var getTopRecipe1 = function () {
    return topRecipe1[0]
  }

  var getMeal = function () {
    return meal;
  }

  var getCuisine = function () {
    return cuisine;
  }

  var getDiet = function () {
    return diet;
  }
  var clearTopRecipes = function(){
     topRecipe0 = [];
     topRecipe1 = [];
  }
  var clearData = function(){
      chosen_ingredients=[];
      recipes=[];
      excluded_ingredients = [];
      meal="";
      cuisine="";
      diet="";
      keywords="";
  }
  var clearRecipes = function() {
    recipes = [];
  }
  return {
    
   addChosenIngredient : addChosenIngredient,
   getChosenIngredients : getChosenIngredients,
   addExcludedIngredient : addExcludedIngredient,
   getExcludedIngredients : getExcludedIngredients,
   getRecipes : getRecipes,
   addRecipe : addRecipe,
   getDiet : getDiet,
   getCuisine : getCuisine,
   getMeal : getMeal,
   addDiet : addDiet,
   addCuisine : addCuisine,
   addMeal : addMeal,
   addKeywords : addKeywords,
   getKeywords : getKeywords,
   clearRecipes : clearRecipes,
   removeIngredient : removeIngredient,
   clearData : clearData,
   clearTopRecipes : clearTopRecipes,
   getTopRecipe1 : getTopRecipe1 ,
   getTopRecipe0 : getTopRecipe0 ,
   addTopRecipe1 : addTopRecipe1,
   addTopRecipe0 : addTopRecipe0
  };      
});

var theIngredientService = angular.module('theIngredientService', ['ngResource']);

theIngredientService.factory('PrimitiveIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/primitiveIngredients', {}, {
      find: {method:'GET', params:{ingredientId: 'primitiveIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'primitiveIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
theIngredientService.factory('TmpIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/tmpIngredients', {}, {
      find: {method:'GET', params:{ingredientId:'tmpIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'tmpIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
theIngredientService.factory('AbstractIngredient', ['$resource',
  function($resource){
    return $resource('api/ingredients/abstractIngredients', {}, {
      find: {method:'GET', params:{ingredientId:'abstractIngredients'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'abstractIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
theIngredientService.factory('Composition', ['$resource',
  function($resource){
    return $resource('api/ingredients/compositions', {}, {
      find: {method:'GET', params:{ingredientId: 'compositions'}, isArray:true},
      //create: {method:'POST', params:{newIngredient: 'primitiveIngredients'}, isArray:true}
      //find: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
var theRecipeService = angular.module('theRecipeService', ['ngResource', 'theIngredientService']);

theRecipeService.service('detailsService', function(){
  var recipeData= {};
  var ingredients = [];
  // default image
  var img = "http://i.imgur.com/Cey1Ud1.jpg";
  var enhancedIngredients = [];
  var type = "yummly"; 

  var setData = function(data) {
      ingredients = [];
      if(data.ingredientLines){
        for (var i =0; i < data.ingredientLines.length; i ++){
          if (data.ingredientLines[i] != data.ingredientLines[i+1])
            ingredients.push(data.ingredientLines[i]);
        }
      }
      if(data.recipe){
        type = data.__t;
        for (var i =0; i < data.recipe.length; i ++){
          ingredients.push(data.recipe[i]);
          enhancedIngredients.push(data.recipe[i]);
        }
      }

      data.img = data.images[0] && data.images[0].hostedLargeUrl.length > 0 ? data.images[0].hostedLargeUrl : img;
      recipeData = data;
      return true;
  }
  var getIngredients = function(){
    return ingredients;
  }
  var getEnhancedIngredients = function(){
    return enhancedIngredients;
  }
 var isEnhanced = function(){
    return type != "yummly";
  }
  var getData = function(){
      return recipeData;
  }

  return {
    setData: setData,
    getData: getData,
    isEnhanced: isEnhanced,
    getEnhancedIngredients: getEnhancedIngredients,
    getIngredients: getIngredients
  };      
});
