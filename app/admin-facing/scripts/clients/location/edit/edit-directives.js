'use strict';

angular.module('emmiManager')

/**
 * This directive shows a warning dialog when a currently active ClientLocation is deactivated
 */
.directive('clientLocationDeactivateWarning', ['$popover', '$timeout', function ($popover, $timeout) {
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.on('click', function (event) {
                event.stopPropagation();
                if (scope.location && !scope.location.active &&
                    scope.originalLocation && scope.originalLocation.active) {
                    // pop a warning dialog
                    $popover(element, {
                        title: 'Are you sure?',
                        scope: scope,
                        trigger: 'manual',
                        autoClose: true,
                        show: true,
                        placement: 'right',
                        target: element,
                        container: 'body',
                        contentTemplate: 'admin-facing/partials/client/location/deactivate_popover.tpl.html'
                    });
                } else {
                    $timeout(function () {
                        scope.saveLocation(scope.locationForm.$valid);
                    });
                }
            });
        }
    };
}]);
