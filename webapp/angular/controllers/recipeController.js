app.controller("recipeController",function($scope){
	this.query_result=[
  {
    name:"Pizza",
  },
  {
    name:"Bacon",
  },
  {
    name:"Beef",
  },
  {
    name:"Broccili",
  },
  {
    name:"Pork",
  }
]
// $scope.chosen_ingredients=[]
this.chosen_ingredients=[
  {
    name:"Cake"
  }
]

this.removeIngredientAndAdd = function(name, container, index){
    container.splice(index,1);
    // $scope.push($scope.chosen_ingredients[index]);
    // console.log("asdasd");
     this.chosen_ingredients.push(name);
     // console.log($scope.chosen_ingredients);
     // console.log("Asdasd");
}
this.removeIngredient = function(container, index){
    container.splice(index,1);
}
});