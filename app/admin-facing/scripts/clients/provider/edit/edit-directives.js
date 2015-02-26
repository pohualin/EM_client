'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active ClientProvider is deactivated
 */
    .directive('clientProviderDeactivateWarning', ['$popover', '$timeout', function ($popover, $timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();
                    if (scope.clientProvider && scope.clientProvider.provider &&
                        scope.clientProvider.provider.entity && !scope.clientProvider.provider.entity.active &&
                        scope.originalClientProvider && scope.originalClientProvider.provider.entity.active) {
                        // pop a warning dialog
                        $popover(element, {
                            title: '',
                            scope: scope,
                            trigger: 'manual',
                            container: 'body',
                            autoClose: true,
                            show: true,
                            placement: 'top',
                            target: element,
                            contentTemplate: 'admin-facing/partials/client/provider/deactivate_popover.tpl.html'
                        });
                    } else {
                        $timeout(function () {
                            scope.saveProvider(scope.providerForm.$valid);
                        });
                    }
                });
            }
        };
    }])

    .directive('clientProviderDeleteWarning', ['$popover', '$timeout', 'ClientProviderService',
        function ($popover, $timeout, ClientProviderService) {
            var popover;
            return {
                restrict: 'EA',
                scope: {
                    onOk: '&onOk',
                    toRemove: '=',
                    onOpenPopover: '&onOpenPopover',
                    onClosePopover: '&onClosePopover'
                },
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.stopPropagation();
                        ClientProviderService.findTeamsUsing(scope.toRemove).then(function (teams) {
                            if (teams && teams.length > 0) {
                                scope.onOpenPopover();
                                scope.teamsBlocking = teams;
                                if (popover) {
                                    popover.hide();
                                }
                                popover = $popover(element, {
                                    title: 'Are you sure?',
                                    scope: scope,
                                    trigger: 'manual',
                                    show: true,
                                    autoClose: true,
                                    placement: 'top',
                                    target: element,
                                    contentTemplate: 'admin-facing/partials/client/provider/delete_popover.tpl.html'
                                });
                                scope.$on('tooltip.hide', function () {
                                    scope.onClosePopover();
                                    scope.$apply();
                                });
                            } else {
                                $timeout(function () {
                                    scope.onOk();
                                    scope.onClosePopover();
                                });
                            }
                        });
                    });
                }
            };
        }])
;
