describe('Recipeasy App', function() {

  describe('Recipeasy search view', function() {

    beforeEach(function() {
      browser.get('#/app/search');
    });


    it('should filter the ingredient list as a user types into the search box', function() {

      var ingredientList = element.all(by.repeater('ingredient in query_result'));
      var query = element(by.model('match'));

      query.sendKeys('large free range egg');
      expect(ingredientList.count()).toBe(1);

    });

    it('should add the ingredients the user selects in the search box to the chosen ingredients list', function() {
      var chosenIngredientList = element.all(by.repeater('ingredient in chosen_ingredients'));
      var query = element(by.model('match'));
      query.sendKeys('large free range egg');
      query.sendKeys(protractor.Key.ENTER);
      expect(chosenIngredientList.count()).toBe(1);
    });

  });
});
