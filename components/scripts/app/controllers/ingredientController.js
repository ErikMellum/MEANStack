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
   * setIngredientName sets the current ingredients name 
   * @param {Ingredient} ingredient
   */
  $scope.setIngredientName = function(ingredientName){
    $scope.currentIngredient.name = ingredientName;
    $scope.ingredientName = ingredientName;
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