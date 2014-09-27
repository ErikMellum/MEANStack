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
    when('/tmpIngredient', {
    templateUrl: 'tmpIngredient',
    controller: 'ApiScrapeController'
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);