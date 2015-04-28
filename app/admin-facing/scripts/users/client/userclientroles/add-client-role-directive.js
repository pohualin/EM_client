'use strict';

angular.module('emmiManager')

.directive('addClientRoleWarning', ['$popover', '$timeout', 'ClientLocationService',
    function ($popover, $timeout, ClientLocationService) {
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
                    console.log('crap');
                    /*
                    event.stopPropagation();
                    ClientLocationService.findTeamsUsing(scope.toRemove).then(function(teams){
                        if (teams && teams.length > 0) {
                            scope.teamsBlocking = teams;
                            scope.onOpenPopover();
                            if (popover){
                                popover.hide();
                            }
                            popover = $popover(element, {
                                title: 'Are you sure?',
                                scope: scope,
                                trigger: 'manual',
                                show: true,
                                autoClose: true,
                                placement: 'bottom',
                                target: element,
                                container: 'body',
                                contentTemplate: 'admin-facing/partials/client/location/delete_popover.tpl.html'
                            });

                            scope.$on('tooltip.hide', function() {
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
                    */
                });
            }
        };
    }])
;
