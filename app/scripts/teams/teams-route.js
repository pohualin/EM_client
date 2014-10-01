'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var clientResource = ['AuthSharedService', 'Client', '$route', '$q', 'ViewTeam', function (AuthSharedService, Client, $route, $q, ViewTeam) {
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    deferred.resolve(clientResource);
                });
            });
            return deferred.promise;
        }];

        var teamClientResource = ['AuthSharedService', 'Client', '$route', '$q', 'ViewTeam', function (AuthSharedService, Client, $route, $q, ViewTeam) {
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    ViewTeam.selectTeam(clientResource.link.teamByTeamId, $route.current.params.teamId).then(function (teamResource) {
                        deferred.resolve({
                            clientResource: clientResource,
                            teamResource: teamResource
                        });
                    });
                });
            });
            return deferred.promise;
        }];

        // Routes
        $routeProvider
            .when('/clients/:clientId/teams/:teamId/view', {
                templateUrl: 'partials/team/team_view.html',
                controller: 'ClientTeamViewCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    'teamClientResource': teamClientResource
                }
            })
            .when('/clients/:clientId/teams/:teamId/edit', {
                templateUrl: 'partials/team/team_edit.html',
                controller: 'TeamEditController',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    'teamClientResource': teamClientResource
                }
            })
            .when('/teams', {
                templateUrl: 'partials/team/team_search.html',
                controller: 'TeamSearchController',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'partials/team/team_edit.html',
                controller: 'ClientTeamCreateCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    'clientResource': clientResource
                }
            });
    })


;

