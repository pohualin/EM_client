'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active ClientProvider is deactivated
 */
    .directive('providerDeactivateWarning', ['$popover', '$timeout', function ($popover, $timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();
                    scope.cancelProviderSave = function () {
                        if (scope.saveClientProviderWarning) {
                            scope.saveClientProviderWarning.hide();
                        }
                    };
                    if(scope.provider && scope.provider.active && scope.providerToEdit && !scope.providerToEdit.active) {
                    	if (!scope.saveClientProviderWarning) {
                            scope.saveClientProviderWarning = $popover(element, {
                                title: '',
                                scope: scope,
                                trigger: 'manual',
                                container: 'body',
                                show: true,
                                placement: 'bottom',
                                target: element,
                                contentTemplate: 'admin-facing/partials/client/provider/deactivate_popover.tpl.html'
                            });
                        } else {
                            scope.saveClientProviderWarning.show();
                        }
                    } else {
                        $timeout(function () {
                            scope.saveProvider(scope.providerForm);
                        });
                    }
                });
            }
        };
    }]);
