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
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'partials/team/team_new.html',
                controller: 'ClientTeamCreateCtrl',
                title: 'New Team',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    'clientResource': clientResource
                }
            })
            .when('/clients/:clientId/teams/:teamId', {
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
                title: 'Team Search',
                resolve: requiredResources,
                reloadOnSearch: false,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });
    })


;

