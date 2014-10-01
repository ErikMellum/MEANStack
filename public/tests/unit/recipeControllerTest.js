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

  it('should verify it can check the scope greeting variable', 
    function() {
      expect(scope.greeting).toBeUndefined();
      scope.testFunction();
      expect(scope.greeting).toBe("Hello Tester");
  });
});