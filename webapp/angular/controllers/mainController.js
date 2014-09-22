var app = angular.module("app",['ngRoute', 'ngAnimate']);

app.controller('mainController',function($scope){
	this.test = "This is an angular test";
	$scope.test = "This is an angular test";
});