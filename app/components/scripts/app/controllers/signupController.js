var signupController = angular.module('signupController', []);

signupController.controller('SignupCtrl', function($scope, $http){
  $scope.signup = function() {
    $http.post('/signup', {'email' : $scope.email, 'password' : $scope.password})
      .success(function(data) {
        $location.path("/profile");
      })
      .error(function(data) {
        console.log('Error: ' + data);
        $location.path("/login");
      });
  };
});

signupController.controller('LoginCtrl', function($scope){
  $scope.message = 'Login';
});

signupController.controller('ProfileCtrl', function($scope){
  $scope.message = 'Profile';
});