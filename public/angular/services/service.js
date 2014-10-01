angular.module('testService', [])
.service('test', function(){
  var recipeName= "";

  var addName = function(name) {
      recipeName = name;
      console.log("setting name to " + name);
  }

  var getName = function(){
      return recipeName;
  }

  return {
    addName: addName,
    getName: getName
  };      
});
