'use strict';

angular.module('emmiManager')

.directive('clientLocationDeleteWarning', ['$popover', '$timeout', 'ClientLocationService',
    function ($popover, $timeout, ClientLocationService) {
        var popover;
        return {
            restrict: 'EA',
            scope: {
                onOk: '&onOk',
                toRemove: '=',
                isDeleting: '=',
                onOpenPopover: '&onOpenPopover',
                onClosePopover: '&onClosePopover'
            },
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.stopPropagation();
                    scope.onOpenPopover();
                    ClientLocationService.findTeamsUsing(scope.toRemove).then(function(teams){
                        if (teams && teams.length > 0) {
                            scope.teamsBlocking = teams;
                            if (popover){
                                popover.hide();
                            }
                            popover = $popover(element, {
                                title: 'Are you sure?',
                                scope: scope,
                                trigger: 'manual',
                                show: true,
                                placement: 'top',
                                target: element,
                                contentTemplate: 'partials/client/location/delete_popover.tpl.html'
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
