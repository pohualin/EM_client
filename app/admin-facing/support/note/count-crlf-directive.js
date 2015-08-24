'use strict';
angular.module('emmiManager')
/**
 * Create a remainingCharacters scope variable that respects thethe textarea specification
 * with regard to newline characters. The specification says that all newlines should be CRLF.
 * Angular uses \n and the textarea spec (used by maxlength) uses \r\n for its count.
 */
    .directive('countCrlf', [
        function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var max = attrs.ngMaxlength | attrs.maxlength;
                    ctrl.$formatters.push(function (value) {
                        if (value) {
                            scope.remainingCharacters = max - value.replace(/\n/g, "\n\r").length;
                        } else {
                            scope.remainingCharacters = max;
                        }
                        return value;
                    });
                    ctrl.$parsers.push(function (value) {
                        if (value) {
                            scope.remainingCharacters = max - value.replace(/\n/g, "\n\r").length;
                        } else {
                            scope.remainingCharacters = max;
                        }
                        return value;
                    });
                }
            };
        }])
;
