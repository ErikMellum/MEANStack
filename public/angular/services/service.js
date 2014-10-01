var recipeService = angular.module('recipeService', []);

recipeService.service('detailsService', function(){
  var recipeName= "";

  var setName = function(name) {
      recipeName = name;
  }

  var getName = function(){
      return recipeName;
  }

  return {
    setName: setName,
    getName: getName
  };      
});
