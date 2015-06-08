var myApp = angular.module('myApp', ['ngRoute','controllers', 'TheDirectives']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/search', {
    templateUrl: 'search',
    controller: 'SearchController'
  }).
    when('/about', {
    templateUrl: 'about',
    controller: 'AboutController'
  }).
    when('/create', {
    templateUrl: 'create',
    controller: 'RecipeController'
  }).
    when('/details/:name', {
    templateUrl: 'details/:name',
    controller: 'DetailsController',
    // resolve: {
    //         recipeData: function(detailsService){
    //           console.log("router");
    //             return detailsService.getData();
    //     }
    //   }
  }).
    when('/tmpIngredient', {
    templateUrl: 'tmpIngredient',
    controller: 'IngredientController'
  }).
  when('/login', {
    templateUrl: 'login',
    controller: 'LoginCtrl'
  }).
  when('/signup', {
    templateUrl: 'signup',
    controller: 'SignupCtrl'
  }).
  when('/user', {
    templateUrl: 'user',
    controller: 'UserCtrl'
  }).
  when('/profile', {
    templateUrl: 'profile',
    controller: 'ProfileCtrl'
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);

