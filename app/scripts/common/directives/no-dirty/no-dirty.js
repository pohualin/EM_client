'use strict';

/**
 * Allows for input elements to not 'dirty' the form when they are changed.
 * For example, let's say you have a checkbox on the form but changing
 * that checkbox state should not make the form dirty (meaning it has modifications).
 * You would simply make the element like so:
 * <input type="checkbox" name="foo" ng-model="x.foo" no-dirty-check>
 */
angular.module('emmi.noDirtyCheck', [])
    .directive('noDirtyCheck', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$pristine = false;
            }
        };
    });
