var ingredientController = angular.module('ingredientController', ['ngEnter', 'ingredientService']);

ingredientController.controller('IngredientController', ['$scope','$http', 'TmpIngredient', 'AbstractIngredient', 
  function($scope, $http, TmpIngredient, AbstractIngredient) {
  //for unit test
  $scope.test = "Test";
  //container for the temp ingredient used 
  $scope.currentIngredient; 
   //container for the parent ingredient used (we need the id to send to the server with our request)
  $scope.parentIngredient;
  //set up temp ingredients list
  $scope.tmpIngredients = TmpIngredient.find();
  //set up abstract ingredients list
  $scope.abstractIngredients = AbstractIngredient.find();

  $scope.searchTmpIngredients;

  $scope.ingredientName;

  //Gets a temporary or abstract ingredient from the list of the respective 
  //ingredients and sets the ingredient name field to be this ingredient if
  //it is part of the respective list, otherwise it sends an alert to the user. 
  $scope.getAndSetIngredient = function(ingredientType, ingredientName){
    var ingredient;
    if(ingredientType == "tempIngredient")
    {
      var test = false;
      $scope.tmpIngredients.forEach(function(element){
        if(element.name == ingredientName)
        {
          $scope.setIngredient(ingredientType, element);
          test = true;
        }
      });
      if(!test) alert("Ingredient not found");
    }
    else if(ingredientType == "abstractIngredient")
    {
      var test = false;
      $scope.abstractIngredients.forEach(function(element){
        if(element.name == ingredientName)
        {
          $scope.setIngredient(ingredientType, element);
          test = true;
        }
      });
      if(!test) alert("Ingredient not found");
    }
  };

  //clear will set the currentIngredient to be nothing, and the ingredient name
  //field to be nothing
  $scope.clear= function() {

    $scope.currentIngredient = "";
    $scope.ingredientName = "";
  }

  //setIngredient allows you to specify a string to set for the new ingredient name
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