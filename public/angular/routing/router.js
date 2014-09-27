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
    when('/landing', {
    templateUrl: 'landing',
    controller: 'LandingController'
  }).
    when('/about', {
    templateUrl: 'about',
    controller: 'AboutController'
  }).
    when('/create', {
    templateUrl: 'create',
    controller: 'InputController'
  }).
  otherwise({
    redirectTo: '/landing'
  });
}]);
