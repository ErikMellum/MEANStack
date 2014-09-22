# How to do Jasmine Testing.#
Learn to create your own Jasmine tests for MEANStack

## Getting Started: ##
**Install Karma**
```
sudo npm install -g karma
```
**Run the Tests**
```
karma start my.conf.js
```

**Test Location**
```
webapp/tests/unit/myTestNameTest.js (Test names must end in 'Test.js')
```

## Example Test: ##

mainControllerTest.js
```
describe('mainController', function(){

it('should receive a variable that says "This is an angular test".', function() {
  var scope = {},
      ctrl = new mainController(scope);

  expect(scope.test).toBe("This is an angular test");
});

});
```