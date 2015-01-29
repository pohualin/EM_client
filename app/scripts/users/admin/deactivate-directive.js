'use strict';
angular.module('emmiManager')

    .directive('toggleUserActive', ['$popover', '$timeout',
        function ($popover, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    okDeactivatePopover: '&onOk',
                    cancelDeactivatePopover: '&onCancel',
                    onOpenPopover: '&onOpenPopover',
                    onClosePopover: '&onClosePopover',
                    currentlyActive: '=isCurrentlyActive',
                    newStatus: '=newStatus',
                    ngModel: '=',
                    placement: '@placement'
                },
                link: function (scope, element) {
                    scope.placement = scope.placement || 'top';
                    scope.$on('tooltip.hide', function () {
                        scope.onClosePopover();
                        scope.$apply();
                    });
                    element.on('click', function () {
                        if (scope.currentlyActive && !scope.newStatus) {
                            scope.onOpenPopover();

                            // pop a warning dialog
                            $popover(element, {
                                title: '',
                                scope: scope,
                                trigger: 'manual',
                                autoClose: true,
                                show: true,
                                placement: scope.placement,
                                contentTemplate: 'partials/user/create/deactivate_popover.tpl.html'
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
