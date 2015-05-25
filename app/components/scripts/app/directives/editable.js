var editable = angular.module('editable', []);

editable.directive('editable', function() {
    var editTemplate = '<input style="cursor: text" ng-model="editable" ng-dblclick="switchToShow()" ng-show="editingMode">';
    var showTemplate = '<span style="cursor: text" ng-hide="editingMode" ng-dblclick="switchToEdit()" ng-bind="editable"></span>';
    return{
        restrict: 'E',
        compile: function (tElement, tAttrs, transclude){
            tElement.html(editTemplate);
            tElement.append(showTemplate);
            return function(scope, element, attrs) {
                scope.editingMode = false;
                scope.editable = scope.data;
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