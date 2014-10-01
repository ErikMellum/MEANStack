angular.module('testService', [])
.service('test', function(){
  var recipeName= "";

  var addName = function(name) {
      recipeName = name;
  }

  var getName = function(){
      return recipeName;
  }

  return {
    addName: addName,
    getName: getName
  };


    this.sayHello= function(text){
        return "Service says \"Hello " + text + "\"";
    };        
});
