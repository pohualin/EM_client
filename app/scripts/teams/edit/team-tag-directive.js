'use strict';
angular.module('emmiManager')
    .directive('cancelClickTeamEdit', ['$popover', '$timeout', '$translate' , function ($popover, $timeout, $translate) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                scope.hide = function () {
                    scope.cancelWarning.hide();
                };
                element.on('click', function () {
                    if (scope.teamClientResource && scope.teamClientResource.teamResource && scope.teamClientResource.teamResource.tags &&
                        JSON.stringify(scope.teamClientResource.teamResource.tags) != JSON.stringify(scope.teamClientResource.teamResource.checkTagsForChanges)) {
                        // pop a warning dialog
                        if (!scope.cancelWarning) {
                            $translate('client_edit_page.cancel_dialog.title').then(function (title) {
                                scope.cancelWarning = $popover(elementk, {
                                    title: title,
                                    scope: scope,
                                    trigger: 'manual',
                                    show: true,
                                    placement: 'top',
                                    contentTemplate: 'partials/team/tags/cancel_popover_team_edit.tpl.html'
                                });
                            });
                        } else {
                            scope.cancelWarning.show();
                        }
                    } else {
                        $timeout(function () {
                            scope.cancel();
                        });
                    }
                });
            }
        };
    }]);
