var editable = angular.module('editable', []);

editable.directive('editable', function() {
    var editTemplate = '<input style="cursor: text" ng-model="editable" ng-click="switchToShow()" ng-show="editingMode">';
    var showTemplate = '<span style="cursor: text" ng-hide="editingMode" ng-dblclick="switchToEdit()" ng-bind="editable"></span>';
    return{
        restrict: 'E',
        //scope:{ data }, breaks the moment you uncomment this line for some reason.... even without the data
        compile: function (tElement, tAttrs, transclude){
            tElement.html(editTemplate);
            tElement.append(showTemplate);
            return function(scope, element, attrs) {
                scope.editingMode = false;
                //scope.editable = scope.data;
                scope.editable = "Something";
                scope.switchToShow = function () {
                    scope.editingMode = false;
                }
                scope.switchToEdit = function () {
                    scope.editingMode = true;
                }
            }
        }
    }
});