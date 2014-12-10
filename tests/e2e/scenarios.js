describe('Recipeasy App', function() {

  describe('Recipeasy search view', function() {
    var ingredientList = element.all(by.repeater('ingredient in query_result'));
    var chosenIngredientList = element.all(by.repeater('ingredient in chosen_ingredients'));
    var topRecipes = element.all(by.repeater('recipe in topRecipes'));
    var recipes = element.all(by.repeater('recipe in recipes'));

    var query = element(by.model('match'));

    beforeEach(function() {
      browser.get('#/app/search');
    });


    it('should filter the ingredient list as a user types into the search box', function() {
      query.sendKeys('large free range egg');
      expect(ingredientList.count()).toBe(1);

    });

    it('should add the ingredients the user selects in the search box to the chosen ingredients list', function() {
      query.sendKeys('large free range egg');
      query.sendKeys(protractor.Key.ENTER);
      expect(chosenIngredientList.count()).toBe(1);
    });
  
  it('Should search the API for relevant recipes and display top recipes', function() {
      query.sendKeys('milk');
      query.sendKeys(protractor.Key.ENTER);
      expect(topRecipes.count()).toBe(2);
    });

  it('Should search the API for relevant recipes and display list of recipes', function() {
      query.sendKeys('cheese');
      query.sendKeys(protractor.Key.ENTER);
      expect(recipes.count()).toBe(9);
    });
  });
});
