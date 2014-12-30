'use strict';
angular.module('emmiManager')

    .directive('toggleUserClientActive', ['$popover', '$timeout',
        function ($popover, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    'okDeactivatePopover': '&onOk',
                    'cancelDeactivatePopover': '&onCancel',
                    'currentlyActive': '=isCurrentlyActive',
                    'newStatus': '=newStatus',
                    'ngModel': '=',
                    'placement': '@placement'
                },
                link: function (scope, element) {
                    scope.placement = scope.placement || 'top';
                    element.on('click', function () {
                        if (scope.ngModel) {
                            scope.ngModel.currentTarget = element;
                        }
                        if (scope.currentlyActive && !scope.newStatus) {
                            // pop a warning dialog
                            $popover(element, {
                                title: '',
                                scope: scope,
                                trigger: 'manual',
                                autoClose: true,
                                show: true,
                                placement: scope.placement,
                                contentTemplate: 'partials/user/client/deactivate_popover.tpl.html'
                            });
                        } else {
                            $timeout(function () {
                                scope.okDeactivatePopover();
                            });
                        }
                    });
                }
            };
        }])
;
