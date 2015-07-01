'use strict';
angular.module('emmiManager')
/**
 * Directive to trim extra chars after a textarea reaches it's maxlength
 */
.directive('trimExtra', [
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var maxlength = parseInt(attrs.ngMaxlength, 10);
                ctrl.$parsers.push(function (value) {
                    if (value.length > maxlength)
                    {
                        value = value.substr(0, maxlength);
                        ctrl.$setViewValue(value);
                        ctrl.$render();
                    }
                    return value;
                });
            }
        };
    }]);