'use strict';
angular.module('emmiManager')
/**
 * By default, angular will not populate an input if the value we set from controller violates ng-pattern.
 * Use this directive when we want to show the value that violates ng-pattern. 
 */
.directive('displayInvalid', function($parse, $filter) {
       
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, model) {
        var displayed = false;
        scope.$watch(attrs.ngModel, function(newValue, oldValue, scope) {
          // only set once... on initial load
          if(displayed === false && newValue !== undefined){
            displayed = true;
            elm.val(model.$modelValue);
            model.$setViewValue(model.$modelValue);
          }
        });
      }
    }
  });