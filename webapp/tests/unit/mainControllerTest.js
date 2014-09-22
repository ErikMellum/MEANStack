describe('mainController', function(){

it('should receive a variable that says "This is an angular test".', function() {
  var scope = {},
      ctrl = new mainController(scope);

  expect(scope.test).toBe("This is an angular test");
});

});