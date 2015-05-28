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
      link: function(scope, elm, attrs, ngModel) {
          scope.$watch(attrs.ngModel, function (newVal, oldVal){
              if (newVal !== undefined){
                  elm.val(newVal);
                  ngModel.$setViewValue(newVal);
              }
          });
      }
    };
  });