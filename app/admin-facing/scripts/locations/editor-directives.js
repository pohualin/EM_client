'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active Location is deactivated
 */
    .directive('locationDeactivateWarning', ['$popover', '$timeout', function ($popover, $timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();
                    scope.cancelLocationSave = function () {
                        if (scope.saveLocationWarning) {
                            scope.saveLocationWarning.hide();
                        }
                    };
                    if(scope.location && scope.location.active && scope.locationToEdit && !scope.locationToEdit.active) {
                    	if (!scope.saveLocationWarning) {
                            scope.saveLocationWarning = $popover(element, {
                                title: 'Are you sure?',
                                scope: scope,
                                trigger: 'manual',
                                container: 'body',
                                show: true,
                                placement: 'right',
                                target: element,
                                contentTemplate: 'admin-facing/partials/location/editor/deactivate_popover.tpl.html'
                            });
                        } else {
                            scope.saveLocationWarning.show();
                        }
                    } else {
                        $timeout(function () {
                            scope.saveLocation(scope.locationForm);
                        });
                    }
                });
            }
        };
    }]);
