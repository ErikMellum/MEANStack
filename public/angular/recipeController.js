var recipeController=angular.module("recipeController",[]);recipeController.controller("RecipeController",["$scope","$http",function(e,n){e.test="Test",e.count="0",e.icount="0",e.ingredient=[],e.quantity=[],e.unit=[],e.instructions=[],e.userName="guest",e.recipeName="",e.inputRecipe=function(t){var o="/api/composition/new/";console.log(e.ingredient),console.log(e.quantity),console.log(e.unit);var r=new Array;for(i=0;i<e.ingredient.length;i++){var c={name:e.ingredient[i],quantity:e.quantity[i],unit:e.unit[i]};r.push(c)}console.log(r),t={name:e.recipeName,ingredients:r,instruction:e.instructions,user:e.userName},postObject=t,n.post(o,postObject).success(function(){})}}]);