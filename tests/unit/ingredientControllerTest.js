describe('Unit: IngredientController', function(){
  var ctrl, scope, TmpIngredient, AbstractIngredient, PrimitiveIngredient;
  var tmpIngredientList, abstractIngredientList, primitiveIngredientList;

  beforeEach(module('myApp', function ($provide){
    TmpIngredient = jasmine.createSpyObj("TmpIngredient", ["find"]);
    AbstractIngredient = jasmine.createSpyObj("AbstractIngredient", ["find"]);
    PrimitiveIngredient = jasmine.createSpyObj("PrimitiveIngredient", ["find"]);

    tmpIngredientList = [{'name': "Grapes"}, {'name': "Corn"}];
    abstractIngredientList = ["Fruit", "Vegetables"];
    primitiveIngredientList =["Jiffy Peanut Butter", "Winco Turkey Pastrami"];

    TmpIngredient.find.andReturn(tmpIngredientList);
    AbstractIngredient.find.andReturn(abstractIngredientList);
    PrimitiveIngredient.find.andReturn(primitiveIngredientList);

    $provide.value("TmpIngredient", TmpIngredient);
    $provide.value("AbstractIngredient", AbstractIngredient);
    $provide.value("PrimitiveIngredient", PrimitiveIngredient);

  }));

  

  beforeEach(inject(function($httpBackend, $controller, $rootScope, TmpIngredient, AbstractIngredient, PrimitiveIngredient) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    mockHttp = $httpBackend;
    TmpIngredient = TmpIngredient;
    AbstractIngredient = AbstractIngredient;
    PrimitiveIngredient = PrimitiveIngredient;
    // Create the controller
    ctrl = $controller('IngredientController', {
      $scope: scope,
      TmpIngredient: TmpIngredient,
      AbstractIngredient: AbstractIngredient,
      PrimitiveIngredient: PrimitiveIngredient
    });
  }));

  it('should verify it can check the scope test variable', 
    function() {
      expect(scope.test).toBe("Test");
  });

  it("Should verify the tempIngredients and abstractIngredients get set up correctly using the factory", function(){
    expect(TmpIngredient.find).toHaveBeenCalled();
    expect(AbstractIngredient.find).toHaveBeenCalled();
    expect(scope.tmpIngredients).toBe(tmpIngredientList);
    expect(scope.abstractIngredients).toBe(abstractIngredientList);
  });


  it("Should verify that the set ingredient function works correctly when passing a correct ingredient", function(){
    var ingredientType = "tempIngredient";
    var ingredient = tmpIngredientList[Math.floor(Math.random()*tmpIngredientList.length)];
    scope.setIngredient(ingredient);
    expect(scope.ingredientName).toBe(ingredient.name); 
  });


  it("Should verify that the clear function works correctly after calling the set ingredient function", function(){
    var ingredientType = "tempIngredient";
    var ingredient = tmpIngredientList[Math.floor(Math.random()*tmpIngredientList.length)];
    scope.setIngredient(ingredient);
    expect(scope.ingredientName).toBe(ingredient.name); 
    scope.clear();
    expect(scope.currentIngredient).toBe("");
    expect(scope.ingredientName).toBe(""); 
  });
  
});