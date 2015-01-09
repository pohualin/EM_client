'use strict';
angular.module('emmiManager')

/**
 * This directive creates a popover on a field when the saveError. The
 * use cases on this are pretty involved, so take caution when you modify
 * this code.
 *
 * The popover is governed by the passed in scope variable saveError.
 * Modification of this variable should only happen outside of this directive.
 * It tried to do some stuff in here and got nasty scope problems.
 *
 * The popover hiding and showing is governed by the validity of the field
 * on which the directive is attached, when the focus happens the popover
 * shows when the blur happens the popover goes away.
 *
 * One last thing, since multiple fields are attached to this directive,
 * the error message can decide whether or not to focus on a particular
 * field. For example, in the case of two errors, only one popover will
 * show up rather than flashing on the screen.
 */
    .directive('popoverSaveError', ['$popover', '$timeout',
        function ($popover, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    saveError: '=saveError'
                },
                require: 'ngModel',
                link: function (scope, element, attributes, ngModelController) {

                    scope.reset = function () {
                        ngModelController.$setValidity('unique', true);
                    };

                    element.on('change', function () {
                        scope.$apply(scope.reset());
                    });

                    element.on('focus', function () {
                        if (ngModelController.$error.unique && scope.conflictingUserPopover) {
                            scope.conflictingUserPopover.show();
                        }
                    });

                    element.on('blur', function () {
                        if (scope.conflictingUserPopover) {
                            scope.conflictingUserPopover.hide();
                        }
                    });

                    scope.$watch('saveError', function (value) {
                        if (value) {
                            ngModelController.$setValidity('unique', false);
                            if (!scope.conflictingUserPopover) {
                                scope.conflictingUserPopover = $popover(element, {
                                    placement: 'top',
                                    scope: scope,
                                    trigger: 'manual',
                                    template: 'partials/user/client/metadata/user_already_exists_popover.tpl.html'
                                });
                            }
                            element.blur();
                            if (!value.doNotFocus) {
                                $timeout(function () {
                                    element.focus();
                                }, 500);
                            }
                        } else {
                            scope.reset();
                        }
                    });
                }
            };
        }
    ])
;
