app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/landing.html',
      }).
      when('/about', {
        templateUrl: 'partials/about.html',
       controller:"aboutController",
       controllerAs:"abc"
      }).
       when('/recipes', {
       templateUrl: 'partials/recipe.html',
       controller:"recipeController",
       controllerAs:"recipes"
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);