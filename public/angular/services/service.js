var recipeService = angular.module('recipeService', []);

recipeService.service('detailsService', function(){
  var recipeData= "";

  var setData = function(data) {
      recipeData = data;
  }

  var getData = function(){
      return recipeData;
  }

  return {
    setData: setData,
    getData: getData
  };      
});
