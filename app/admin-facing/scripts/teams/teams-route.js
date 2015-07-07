'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        var clientResource = ['AuthSharedService', 'Client', '$route', '$q', function (AuthSharedService, Client, $route, $q) {
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    if (clientResource) {
                        deferred.resolve(clientResource);
                    } else {
                        deferred.reject();
                    }
                });
            });
            return deferred.promise;
        }];
        
        var teamResource = ['AuthSharedService', 'Client', 'ViewTeam', '$route', '$q', function (AuthSharedService, Client, ViewTeam, $route, $q) {
            var deferred = $q.defer();
            AuthSharedService.currentUser().then(function () {
                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                    if (clientResource) {
                        ViewTeam.selectTeam(clientResource.link.teamByTeamId, $route.current.params.clientId).then(function (teamResource) {
                            if (teamResource) {
                                deferred.resolve(teamResource);
                            } else {
                                deferred.reject();
                            }
                        });
                    } else {
                        deferred.reject();
                    }
                });
            });
            return deferred.promise;
        }];

        // Routes
        $routeProvider
            .when('/clients/:clientId/teams/new', {
                templateUrl: 'admin-facing/partials/team/team_new.html',
                controller: 'ClientTeamCreateCtrl',
                title: 'New Team | ClientManager',
                activeMenu: MENU.setup,
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                resolve: {
                    'clientResource': clientResource
                }
            })
            .when('/clients/:clientId/teams/:teamId/new', {
                templateUrl: 'admin-facing/partials/team/team_new.html',
                controller: 'ClientTeamCreateCtrl',
                title: 'New Team | ClientManager',
                activeMenu: MENU.setup,
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                resolve: {
                    'clientResource': clientResource,
                    'teamResource': teamResource
                }
            })
            .when('/teams', {
                templateUrl: 'admin-facing/partials/team/team_search.html',
                controller: 'TeamSearchController',
                title: 'Team Search | ClientManager',
                activeMenu: MENU.setup,
                resolve: requiredResources,
                reloadOnSearch: false,
                access: {
                    authorizedRoles: USER_ROLES.all
                }
            });
    })


;

