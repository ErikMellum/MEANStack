describe('Unit: AboutController', function(){

  beforeEach(module('myApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('AboutController', {
      $scope: scope
    });
  }));

  it('should verify it can check the scope test variable', 
    function() {
      expect(scope.test).toBe("Hello");
  });

});