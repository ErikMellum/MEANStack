var myApp = angular.module('myApp', [
  'ngRoute',
  'TheControllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/recipes', {
    templateUrl: 'partials/recipe.html',
    controller: 'RecipeController'
  }).
    when('/home', {
    templateUrl: 'partials/landing.html',
    controller: 'LandingController'
  }).
    when('/about', {
    templateUrl: 'partials/about.html',
    controller: 'AboutController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);