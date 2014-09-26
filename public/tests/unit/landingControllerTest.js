describe('Unit: LandingController', function(){

  beforeEach(module('myApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('LandingController', {
      $scope: scope
    });
  }));

  it('should create $scope.greeting when calling testFunction', 
    function() {
      expect(scope.greeting).toBeUndefined();
      scope.testFunction();
      expect(scope.greeting).toEqual("Hello Tester");
  });

});