describe('Unit: SearchController', function(){

  beforeEach(module('myApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('SearchController', {
      $scope: scope
    });
  }));

  it('should add an ingredient to the chosen_ingredients array', 
    function() {
      expect(scope.chosen_ingredients.length).toBe(0);
      scope.switchAndDisplay('Test',scope.query_result,0);
      expect(scope.chosen_ingredients.length).toBe(1);
  });

});