'use strict';
angular.module('emmiManager')
/**
 * By default, angular will not update the model value until it's considered 'valid'.
 * This causes issues for validating ng-pattern with optional fields.
 * Use this directive for optional fields that also follow ng-pattern validations.
 */
.directive('optionalPattern', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel) {
        element.on('blur keyup', function(e) {
          if (element.val() === '') {
            ngModel.$setValidity('pattern', true);
          }
        });
      }
    };
  });
