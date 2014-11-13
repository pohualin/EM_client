'use strict';

angular.module('emmiManager')

    .service('EditTeam', function ($http, $q, Session, UriTemplate) {
        return {
            save: function (team, uri) {
                return $http.put(UriTemplate.create(uri).stringify(), team).
                    then(function (response) {
                        return response;
                    });
            }
        };
    })

    .directive('teamEditSave', ['$popover', '$timeout', '$translate', function ($popover, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'okDeactivatePopover': '&onOk',
                'teamEntity': '=teamEntity',
                'placement': '@placement'
            },
            link: function (scope, element) {
                scope.cancelDeactivatePopover = function () {
                    scope.saveWarning.hide();
                    var teamEntity = scope.teamEntity;
                    if (teamEntity) {
                        teamEntity.active = true;
                    }
                };
                var placement = scope.placement || 'right';
                element.on('click', function () {
                    var teamEntity = scope.teamEntity;
                    if (!teamEntity.active && teamEntity.currentlyActive) {
                        // pop a warning dialog
                        if (!scope.saveWarning) {
                            $translate('team_edit_page.deactivate_dialog.title').then(function (title) {
                                scope.saveWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    show: true,
                                    placement: placement,
                                    contentTemplate: 'partials/team/deactivate_popover.tpl.html'
                                });
                            });
                        } else {
                            scope.saveWarning.show();
                        }
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
