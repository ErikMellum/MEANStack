var myApp = angular.module('myApp', [
  'ngRoute',
  'TheControllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/recipes', {
    templateUrl: 'recipe',
    controller: 'RecipeController'
  }).
  when('/search', {
    templateUrl: 'search',
    controller: 'SearchController'
  }).
    when('/about', {
    templateUrl: 'about',
    controller: 'AboutController'
  }).
<<<<<<< HEAD
    when('/create', {
    templateUrl: 'create',
    controller: 'InputController'
=======
    when('/details/:name', {
    templateUrl: 'details/:name',
    controller: 'RecipeController'
  }).
    when('/tmpIngredient', {
    templateUrl: 'tmpIngredient',
    controller: 'ApiScrapeController'
>>>>>>> 0fc0fce0ede5a8c743c1aec69ad4b5ffe2e9441f
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);
