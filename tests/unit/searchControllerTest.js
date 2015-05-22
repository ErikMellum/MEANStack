describe('Unit: SearchController', function(){

  beforeEach(module('myApp'));
  var SearchCtrl, scope, mockHttp, url;
 
  beforeEach(inject(function($httpBackend, $controller, $rootScope) {
    mockHttp = $httpBackend;
    scope = $rootScope.$new();
    SearchCtrl = $controller('SearchController', {
      $scope: scope
    });
  }));

  it('should add an ingredient to the chosen_ingredients array', 
    function() {
      expect(scope.chosen_ingredients.length).toBe(0);
      scope.switchAndDisplay('Test',scope.query_result,0);
      expect(scope.chosen_ingredients.length).toBe(1);
  });

  it ('should post successfully', 
    function(){
      var postObject = {"ingredients" : ['free range egg']};
      url = '/api/composition/withIngredients/';
      mockHttp.whenPOST(url, postObject).respond(201, 'success');
      mockHttp.expectPOST(url).respond(201, 'success');
  });

  it ('should query an ingredient correctly', 
    function(){
      var ingredientRequestHandler = mockHttp.when('POST', '/api/ingredients/')
      .respond({data: ['free range eggs', 'large eggs']});

      var postObject = {"ingredient" : 'egg'};
      url = '/api/ingredients/';
      mockHttp.expectPOST(url).respond(200, {
          data: ['free range eggs', 'large eggs']
      });
  });

  it ('should reset the match and query_result variables', 
    function(){
     scope.query_result = ["NotNil"];
     scope.match = "NotNil"; 
     expect(scope.match).toBe("NotNil");
     scope.reset();
     expect(scope.match).toBe("");
     expect(scope.query_result.length).toBe(0)
  });
   it ('should insert an ingredient into the chosen and excluded ingredients', 
    function(){
      expect(scope.chosen_ingredients.length).toBe(0)
      scope.insert("ingredient");
      expect(scope.chosen_ingredients[0].name).toBe("ingredient");
      scope.insert("not cake")
      expect(scope.excluded_ingredients[0].name).toBe("cake");
 });
it ('should not insert ingredients with the same name', 
    function(){
      expect(scope.chosen_ingredients.length).toBe(0)
      scope.insert("Ingredient");
      expect(scope.chosen_ingredients.length).toBe(1);
      scope.insert("Ingredient");
      expect(scope.chosen_ingredients.length).toBe(1);
      scope.insert("not cake")
      expect(scope.excluded_ingredients.length).toBe(1);
      scope.insert("not cake")
       expect(scope.excluded_ingredients.length).toBe(1);
 });
  it ('should remove an ingredient from the chosen and excluded ingredients', 
    function(){
      expect(scope.chosen_ingredients.length).toBe(0)
      scope.insert("ingredient");
      expect(scope.chosen_ingredients[0].name).toBe("ingredient");
      scope.insert("not pizza");
      expect(scope.excluded_ingredients[0].name).toBe("pizza");
      scope.remove(scope.chosen_ingredients, 0);
      scope.remove(scope.excluded_ingredients, 0);
      expect(scope.chosen_ingredients.length).toBe(0);
      expect(scope.excluded_ingredients.length).toBe(0);
  });

 //   it('should have a working nav that redirects to teh search controller by default if a bad url is entered', function() {
 //   browser().navigateTo('#/dsadasdasd');
 //   expect(browser().location().path()).toBe("#/search");
 // });
//doesnt work becuase browser is not defined

    it ('should make sure the clear data function clears all the ingredients on the page', 
    function(){
      scope.insert("ingredient");
      scope.insert("not pizza");
      scope.insert("milk");
      scope.clearData();
      expect(scope.chosen_ingredients.length).toBe(0);
      expect(scope.excluded_ingredients.length).toBe(0);
  });

    it ('should make sure the clear data function doesnt prevent a user from adding new ingredients', 
    function(){
      scope.insert("ingredient");
      scope.insert("not pizza");
      scope.insert("milk");
      scope.clearData();
      expect(scope.chosen_ingredients.length).toBe(0);
      expect(scope.excluded_ingredients.length).toBe(0);
      scope.insert("ingredient");
      scope.insert("not pizza");
      expect(scope.chosen_ingredients.length).toBe(1);
      expect(scope.excluded_ingredients.length).toBe(1);
  });
});
