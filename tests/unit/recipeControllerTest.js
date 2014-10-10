describe('Unit: RecipeController', function(){

  beforeEach(module('myApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('RecipeController', {
      $scope: scope
    });
  }));

  it('should add an ingredient to the chosen_ingredients array', 
    function() {
      expect(scope.test).toBe("Test");
  });

});