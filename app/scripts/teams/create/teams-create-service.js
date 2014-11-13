'use strict';
angular.module('emmiManager')
    .service('CreateTeam', function ($http, $q, Session, UriTemplate) {
        return {
            newTeam: function () {
                var selectedTeam = {
                    entity: {
                        'name': null,
                        'description': null,
                        'active': true,
                        'phone': null,
                        'fax': null,
                        'client': {
                            'id': null
                        },
                        'normalizedTeamName': null
                    }
                };
                return selectedTeam;
            },
            insertTeams: function (team) {
                return $http.post(UriTemplate.create(Session.link.teamsByClientId).stringify({clientId: team.client.id}), team).
                    then(function (response) {
                        return response;
                    });
            },
            findNormalizedName: function (url, searchString, clientId) {
                return $http.get(UriTemplate.create(url).stringify({
                        clientId: clientId,
                        normalizedName: searchString
                    }
                )).then(function (response) {
                    return response.data;
                });
            }
        };
    })

    .directive('uniqueTeamName', ['$popover', 'CreateTeam', '$translate', function ($popover, CreateTeam, $translate) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                url: '=uniqueUrl',
                team: '='
            },
            link: function (scope, element, attrs, ngModel) {

                element.on('keydown', function () {
                    if (scope.uniquePopup) {
                        scope.uniquePopup.hide();
                        ngModel.$setValidity('unique', true);
                    }
                });

                element.on('blur', function () {
                    CreateTeam.findNormalizedName(scope.url, element.val(), scope.team.client.id).then(function (searchResults) {
                        scope.existsTeam = searchResults;
                        if (scope.existsTeam.entity === undefined) {
                            ngModel.$setValidity('unique', true);
                            if (scope.uniquePopup) {
                                scope.uniquePopup.hide();
                            }
                        } else {
                            if ((scope.team.id !== scope.existsTeam.entity.id)) {
                                ngModel.$setValidity('unique', false);
                                if (scope.uniquePopup) {
                                    scope.uniquePopup.show();
                                }
                                else {
                                    scope.uniquePopup = $popover(element, {
                                        placement: 'top-right',
                                        scope: scope,
                                        trigger: 'manual',
                                        show: true,
                                        contentTemplate: 'partials/team/unique_team_popover.tpl.html'
                                    });
                                }
                            }
                        }
                    });
                });
            }
        };
    }])

;
