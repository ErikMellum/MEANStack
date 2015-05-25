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