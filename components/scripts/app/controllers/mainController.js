var mainController = angular.module('mainController', []);

mainController.controller('MainController', ['$scope','$http', function($scope, $http) {
   $scope.links = ['Search', 'About', 'Create'];
   $scope.select= function(item) {
     $scope.selected = item; 
   };

   $scope.isActive = function(item) {
     return $scope.selected === item;
   };
}]);